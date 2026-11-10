/** Value of `editor.quickSuggestions`: a boolean or a per-context object */
export type QuickSuggestionsValue = boolean | Record<string, boolean | string>

/** What the toggle writes, and what it remembers for switching back on */
export interface ToggleResult {
  /** New setting value; `undefined` removes it so VS Code's default applies */
  value: QuickSuggestionsValue | undefined
  /** Value to remember while switched off (`null` = the setting was not set) */
  remember?: QuickSuggestionsValue | null
}
