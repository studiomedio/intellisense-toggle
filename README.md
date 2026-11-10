# IntelliSense Toggle — VS Code extension

Toggle VS Code IntelliSense (quick suggestions) on and off with one shortcut. Handy when you use
GitHub Copilot or another inline completion and don't want the suggestion list popping up first.

## Features

- **Toggle IntelliSense** — `⌥⌘I` on macOS, `Ctrl+Alt+I` elsewhere (while the editor has focus),
  or click the status bar item.
- **Status bar** — `IntelliSense: ON` / `OFF`, updated whenever `editor.quickSuggestions` changes,
  also when you edit it in Settings.
- **Your settings are kept** — turning off writes `false`; turning on restores the exact previous
  value, including per-context settings like `{ "other": "on", "comments": "on", "strings": "off" }`,
  or removes the setting again if you never set it.
- If `editor.quickSuggestions` is set in the workspace settings, the toggle changes it there;
  otherwise in your user settings.

## Keybindings

The default shortcut only applies while the editor has focus, so `⌥⌘I` still opens the Developer
Tools elsewhere on macOS. To use a different key, search for `toggleIntelliSense` in
**Keyboard Shortcuts**, or add to `keybindings.json` (macOS shown):

```json
[
  { "key": "cmd+alt+i", "command": "-toggleIntelliSense" },
  { "key": "ctrl+shift+space", "command": "toggleIntelliSense", "when": "editorTextFocus" }
]
```

## Development

```bash
npm install
npm run watch              # rebuild on change; press F5 to launch the Extension Development Host
npm run typecheck
npm test                   # unit tests (src/core, plain Node)
npm run test:integration   # end-to-end in a downloaded VS Code (cached in .vscode-test/)
npm run package            # -> intellisense-toggle-<version>.vsix
```

See [PUBLISHING.md](PUBLISHING.md) for releases.

## License

MIT
