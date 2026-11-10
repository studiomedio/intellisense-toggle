import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import * as esbuild from 'esbuild'
import type { BuildOptions, Plugin } from 'esbuild'

const production = process.argv.includes('--production')
const watch = process.argv.includes('--watch')
const test = process.argv.includes('--test')
const integration = process.argv.includes('--integration')

// Prints the lines the `npm: watch` task's problem matcher (.vscode/tasks.json) waits for, so F5
// knows when the build is ready and errors land in the Problems panel.
const watchReporter: Plugin = {
  name: 'watch-reporter',
  setup(build) {
    build.onStart(() => console.log('[watch] build started'))
    build.onEnd((result) => {
      for (const { text, location } of result.errors) {
        console.error(`✘ [ERROR] ${text}`)
        if (location) console.error(`    ${location.file}:${location.line}:${location.column + 1}:`) // esbuild columns are 0-based
      }
      console.log('[watch] build finished')
    })
  },
}

const node: BuildOptions = {
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node18',
}

// Desktop and remote; the extension only reads and writes settings.
const extension: BuildOptions = {
  ...node,
  entryPoints: ['src/extension.ts'],
  external: ['vscode'],
  outfile: 'dist/extension.js',
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
  ...(watch ? { logLevel: 'silent', plugins: [watchReporter] } : {}),
}

// Unit tests cover the modules without a `vscode` dependency and run on `node --test`.
const unitTests = (): BuildOptions => ({
  ...node,
  entryPoints: readdirSync('test')
    .filter((f) => f.endsWith('.test.ts'))
    .map((f) => join('test', f)),
  outdir: 'out-test',
  sourcemap: true,
  logLevel: 'warning',
})

const integrationSuite: BuildOptions = {
  ...node,
  entryPoints: ['test/integration/suite.ts'],
  external: ['vscode'],
  outfile: 'out-test/integration/suite.js',
  logLevel: 'warning',
}

async function main(): Promise<void> {
  if (test) {
    rmSync('out-test', { recursive: true, force: true })
    await esbuild.build(unitTests())
    return
  }
  if (integration) {
    await esbuild.build(integrationSuite)
    return
  }

  const ctx = await esbuild.context(extension)
  if (watch) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

main().catch((e: unknown) => {
  console.error(e)
  process.exit(1)
})
