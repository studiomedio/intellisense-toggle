import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let toggleIntelliSense = vscode.commands.registerCommand('toggleIntelliSense', () => {
        const config = vscode.workspace.getConfiguration();
        const current = config.get<boolean>('editor.quickSuggestions');

        // Toggle the setting
        config.update('editor.quickSuggestions', !current, vscode.ConfigurationTarget.Global)
            .then(() => {
                vscode.window.showInformationMessage(`IntelliSense ${!current ? 'ON' : 'OFF'}`);
            });
    });

    context.subscriptions.push(toggleIntelliSense);
}

export function deactivate() {}
