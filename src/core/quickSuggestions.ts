import type { QuickSuggestionsValue, ToggleResult } from '../types/quickSuggestions'

/**
 * Whether quick suggestions are on for any context. The setting is usually an object such as
 * `{ other: 'on' | 'inline' | 'offWhenInlineCompletions', comments: 'off', strings: 'off' }`
 * (the default since VS Code 1.10x), so a plain truthiness check is wrong.
 */
export function isEnabled(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'boolean') return value
  if (typeof value === 'object') {
    return Object.values(value).some((v) => v === true || (typeof v === 'string' && v !== 'off'))
  }
  return Boolean(value)
}

/**
 * Turning off writes `false` and remembers the previous value (including per-context
 * objects); turning on restores it, or removes the setting so the default applies.
 */
export function toggle(
  effective: unknown,
  current: QuickSuggestionsValue | undefined,
  remembered: QuickSuggestionsValue | null | undefined,
): ToggleResult {
  if (isEnabled(effective)) return { value: false, remember: current ?? null }
  if (remembered !== undefined && remembered !== null && isEnabled(remembered)) {
    return { value: remembered }
  }
  return { value: undefined }
}
