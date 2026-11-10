import * as vscode from 'vscode'
import { isEnabled, toggle } from './core/quickSuggestions'
import type { QuickSuggestionsValue } from './types/quickSuggestions'

const SETTING = 'quickSuggestions'
const REMEMBERED = 'previousQuickSuggestions'

export function activate(context: vscode.ExtensionContext): void {
  const item = vscode.window.createStatusBarItem(
    'intellisenseToggle.status',
    vscode.StatusBarAlignment.Right,
    100,
  )
  item.name = 'IntelliSense Toggle'
  item.command = 'toggleIntelliSense'

  const update = () => {
    const enabled = isEnabled(vscode.workspace.getConfiguration('editor').get(SETTING))
    item.text = `IntelliSense: ${enabled ? '$(check) ON' : '$(x) OFF'}`
    item.color = new vscode.ThemeColor(enabled ? 'charts.green' : 'charts.yellow')
    item.tooltip = `Quick suggestions are ${enabled ? 'on' : 'off'} — click to toggle`
    item.show()
  }

  context.subscriptions.push(
    item,
    vscode.commands.registerCommand('toggleIntelliSense', async () => {
      const config = vscode.workspace.getConfiguration('editor')
      const inspected = config.inspect<QuickSuggestionsValue>(SETTING)
      // Write where the value is defined, so a workspace override doesn't make the toggle a no-op
      const target =
        inspected?.workspaceValue !== undefined
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.Global
      const current =
        target === vscode.ConfigurationTarget.Workspace
          ? inspected?.workspaceValue
          : inspected?.globalValue
      const result = toggle(
        config.get(SETTING),
        current,
        context.globalState.get<QuickSuggestionsValue | null>(REMEMBERED),
      )
      if (result.remember !== undefined)
        await context.globalState.update(REMEMBERED, result.remember)
      await config.update(SETTING, result.value, target)
      void vscode.window.showInformationMessage(
        `IntelliSense ${result.value === false ? 'OFF' : 'ON'}`,
      )
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(`editor.${SETTING}`)) update()
    }),
  )
  update()
}

export function deactivate(): void {}
