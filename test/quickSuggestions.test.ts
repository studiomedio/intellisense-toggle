import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { isEnabled, toggle } from '../src/core/quickSuggestions'

const DEFAULT = { other: 'offWhenInlineCompletions', comments: 'off', strings: 'off' }

test('isEnabled understands booleans, per-context objects and the default', () => {
  assert.equal(isEnabled(undefined), true)
  assert.equal(isEnabled(true), true)
  assert.equal(isEnabled(false), false)
  assert.equal(isEnabled(DEFAULT), true)
  assert.equal(isEnabled({ other: 'on', comments: 'off' }), true)
  assert.equal(isEnabled({ other: 'inline' }), true)
  assert.equal(isEnabled({ other: true, comments: false }), true)
  assert.equal(isEnabled({ other: 'off', comments: 'off', strings: 'off' }), false)
})

test('turning off remembers the per-context object', () => {
  const custom = { other: 'on', comments: 'on', strings: 'off' }
  assert.deepEqual(toggle(custom, custom, undefined), { value: false, remember: custom })
})

test('turning off with no user value remembers that it was unset', () => {
  assert.deepEqual(toggle(DEFAULT, undefined, undefined), { value: false, remember: null })
})

test('turning on restores the remembered value', () => {
  const custom = { other: 'on', comments: 'on', strings: 'off' }
  assert.deepEqual(toggle(false, false, custom), { value: custom })
})

test('turning on without a usable remembered value removes the setting', () => {
  assert.deepEqual(toggle(false, false, null), { value: undefined })
  assert.deepEqual(toggle(false, false, undefined), { value: undefined })
  assert.deepEqual(toggle({ other: 'off' }, { other: 'off' }, { other: 'off' }), {
    value: undefined,
  })
})
