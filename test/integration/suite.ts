import { strict as assert } from 'node:assert'
import * as vscode from 'vscode'

// Runs inside a real VS Code instance (see run.js). Minimal runner — no mocha needed.
const cases: [string, () => Promise<void>][] = []
const test = (name: string, fn: () => Promise<void>) => cases.push([name, fn])

const editor = () => vscode.workspace.getConfiguration('editor')
const userValue = () => editor().inspect('quickSuggestions')?.globalValue
const toggle = () => vscode.commands.executeCommand('toggleIntelliSense')

test('extension activates and registers the toggle', async () => {
  const extension = vscode.extensions.getExtension('studiomedio.intellisense-toggle')
  assert.ok(extension, 'extension is installed')
  await extension.activate()
  assert.ok((await vscode.commands.getCommands(true)).includes('toggleIntelliSense'))
})

test('with the default setting: off writes false, on removes the setting again', async () => {
  assert.equal(userValue(), undefined)
  await toggle()
  assert.equal(userValue(), false)
  await toggle()
  assert.equal(userValue(), undefined)
})

test('a per-context value survives an off/on round trip', async () => {
  const custom = { other: 'on', comments: 'on', strings: 'off' }
  await editor().update('quickSuggestions', custom, vscode.ConfigurationTarget.Global)
  await toggle()
  assert.equal(userValue(), false)
  await toggle()
  assert.deepEqual(userValue(), custom)
  await editor().update('quickSuggestions', undefined, vscode.ConfigurationTarget.Global)
})

export async function run(): Promise<void> {
  const failures: string[] = []
  for (const [name, fn] of cases) {
    try {
      await fn()
      console.log(`  ✔ ${name}`)
    } catch (error) {
      console.log(
        `  ✘ ${name}\n${String((error as Error).stack ?? error).replace(/^/gm, '      ')}`,
      )
      failures.push(name)
    }
  }
  console.log(`\n${cases.length - failures.length} passed, ${failures.length} failed`)
  if (failures.length > 0) throw new Error(`${failures.length} integration test(s) failed`)
}
