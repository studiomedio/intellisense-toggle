# Changelog

## 1.3.0

- The status bar indicator now shows right after startup (it used to appear only after the first
  toggle).
- Per-context `editor.quickSuggestions` settings are restored when turning IntelliSense back on,
  instead of being replaced by `true`.
- Correct ON/OFF state for object values, including VS Code's `offWhenInlineCompletions` default.
- The status bar follows changes made in Settings; colours follow the theme.
- A workspace-level `editor.quickSuggestions` is toggled where it is defined.
- Bundled with esbuild; smaller package.

## 1.2.1

- Status bar indicator wired up.

## 1.2.0

- Status bar indicator for the IntelliSense state.

## 1.1.0

- Smaller icon file.
- License file.

## 1.0.0

Initial release.
