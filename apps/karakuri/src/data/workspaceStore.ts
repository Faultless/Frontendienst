/**
 * Workspace persistence: auto-save to localStorage on every real change,
 * restore on load, and versioned JSON export/import (web-app skill rule 5 —
 * local-first data the user can't move is a trap).
 *
 * Sanctioned deviation from the skill's Dexie rule (ADR 0005): the entire
 * persisted state is one small Blockly JSON document, so localStorage is the
 * right-sized store; there is no tabular data to put behind repos.
 */

import * as Blockly from "blockly";
import type { WorkspaceJson } from "../domain/lessons";

const STORAGE_KEY = "karakuri.workspace.v1";
const EXPORT_APP = "karakuri";
const EXPORT_VERSION = 1;

export function saveWorkspace(workspace: Blockly.Workspace): void {
  const state = Blockly.serialization.workspaces.save(workspace);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota/private-mode failures shouldn't break editing.
  }
}

/** Restore the auto-saved workspace. Returns false when nothing (valid) is saved. */
export function loadSavedWorkspace(workspace: Blockly.Workspace): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const state: unknown = JSON.parse(raw);
    if (typeof state !== "object" || state === null) return false;
    Blockly.serialization.workspaces.load(state as WorkspaceJson, workspace);
    return true;
  } catch {
    return false;
  }
}

export function loadWorkspaceJson(workspace: Blockly.Workspace, json: WorkspaceJson): void {
  Blockly.serialization.workspaces.load(json, workspace);
}

export function exportWorkspaceJson(workspace: Blockly.Workspace): string {
  return JSON.stringify(
    {
      app: EXPORT_APP,
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      workspace: Blockly.serialization.workspaces.save(workspace),
    },
    null,
    2,
  );
}

/** Validates and replaces the current workspace. Throws with a readable message. */
export function importWorkspaceJson(workspace: Blockly.Workspace, text: string): void {
  let doc: unknown;
  try {
    doc = JSON.parse(text);
  } catch {
    throw new Error("Not a JSON file.");
  }
  if (typeof doc !== "object" || doc === null) throw new Error("Not a karakuri export.");
  const record = doc as Record<string, unknown>;
  if (record["app"] !== EXPORT_APP) throw new Error("Not a karakuri export.");
  if (record["version"] !== EXPORT_VERSION) {
    throw new Error(`Unsupported export version ${String(record["version"])}.`);
  }
  const state = record["workspace"];
  if (typeof state !== "object" || state === null) throw new Error("Export has no workspace.");
  Blockly.serialization.workspaces.load(state as WorkspaceJson, workspace);
  saveWorkspace(workspace);
}
