/**
 * Dark Blockly theme so the editor chrome doesn't glare white against the
 * stone-950 shell. Block colours stay Classic (kid-bright reads well on
 * dark); only the workspace/toolbox/flyout chrome is restyled.
 */

import * as Blockly from "blockly";

export const karakuriTheme = Blockly.Theme.defineTheme("karakuri-dark", {
  name: "karakuri-dark",
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#1c1917", // stone-900
    toolboxBackgroundColour: "#0c0a09", // stone-950
    toolboxForegroundColour: "#d6d3d1", // stone-300
    flyoutBackgroundColour: "#292524", // stone-800
    flyoutForegroundColour: "#d6d3d1",
    flyoutOpacity: 0.97,
    scrollbarColour: "#57534e", // stone-600
    scrollbarOpacity: 0.45,
    insertionMarkerColour: "#f5f5f4",
    insertionMarkerOpacity: 0.35,
    markerColour: "#fbbf24",
    cursorColour: "#fbbf24",
    selectedGlowColour: "#fbbf24",
    selectedGlowOpacity: 0.6,
  },
  fontStyle: {
    family: "ui-sans-serif, system-ui, sans-serif",
    size: 10.5,
  },
});
