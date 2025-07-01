import * as vscode from "vscode";
import { variables } from "./variables";
import { PackLensEditorProvider } from "./PackLensEditorProvider";

export function activate(context: vscode.ExtensionContext) {
  variables.extensionMode = context.extensionMode;
  context.subscriptions.push(...PackLensEditorProvider.register(context));
}

export function deactivate() {}
