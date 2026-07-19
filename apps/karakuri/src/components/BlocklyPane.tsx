/**
 * The one sanctioned React deviation (ADR 0005): Blockly owns its DOM
 * subtree inside this ref'd div; React renders only the shell around it.
 */

import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { defineTurtleBlocks } from "../blocks/turtleBlocks";
import { karakuriTheme } from "../blocks/theme";
import { toolbox } from "../blocks/toolbox";
import { FIRST_LESSON } from "../domain/lessons";
import { loadSavedWorkspace, loadWorkspaceJson, saveWorkspace } from "../data/workspaceStore";

defineTurtleBlocks();

export function BlocklyPane({
  onWorkspace,
}: {
  readonly onWorkspace: (workspace: Blockly.WorkspaceSvg | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const workspace = Blockly.inject(host, {
      toolbox,
      theme: karakuriTheme,
      renderer: "zelos",
      trashcan: true,
      zoom: { controls: true, wheel: true, startScale: 0.75, minScale: 0.4, maxScale: 1.5 },
      grid: { spacing: 24, length: 2, colour: "#292524", snap: true },
      move: { scrollbars: true, drag: true, wheel: false },
    });

    // Restore the auto-saved workspace, or seed lesson 1's starter blocks.
    if (!loadSavedWorkspace(workspace)) {
      loadWorkspaceJson(workspace, FIRST_LESSON.starter);
    }

    // Auto-save on every real (non-UI) change.
    const listener = (event: Blockly.Events.Abstract): void => {
      if (event.isUiEvent || workspace.isDragging()) return;
      saveWorkspace(workspace);
    };
    workspace.addChangeListener(listener);

    const resizeObserver = new ResizeObserver(() => Blockly.svgResize(workspace));
    resizeObserver.observe(host);

    onWorkspace(workspace);
    return () => {
      resizeObserver.disconnect();
      onWorkspace(null);
      workspace.dispose();
    };
    // onWorkspace is stable (useCallback in App).
  }, [onWorkspace]);

  return <div ref={hostRef} className="h-full w-full" />;
}
