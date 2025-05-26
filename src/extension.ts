import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'toggleIntelliSense';
  updateStatusBar();

  let disposable = vscode.commands.registerCommand('toggleIntelliSense', () => {
    const config = vscode.workspace.getConfiguration();
    const current = config.get<boolean>('editor.quickSuggestions');
    config.update('editor.quickSuggestions', !current, vscode.ConfigurationTarget.Global)
      .then(() => {
        updateStatusBar();
        vscode.window.showInformationMessage(`IntelliSense ${!current ? 'ON' : 'OFF'}`);
      });
  });

  context.subscriptions.push(disposable, statusBarItem);
}

function updateStatusBar() {
  const isEnabled = vscode.workspace.getConfiguration().get<boolean>('editor.quickSuggestions');
  statusBarItem.text = `IntelliSense: ${isEnabled ? '$(check) ON' : '$(x) OFF'}`;
  statusBarItem.color = isEnabled ? 'lightgreen' : 'yellow';
  statusBarItem.show();
}

export function deactivate() {}
