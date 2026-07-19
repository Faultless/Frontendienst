/**
 * Custom turtle blocks + their JavaScript generators. The generators emit
 * calls against the sandbox API the runner installs into JS-Interpreter
 * (moveForward, turnRight, penDown, …) — readable ES5, on purpose.
 */

import * as Blockly from "blockly";
import { javascriptGenerator, Order } from "blockly/javascript";

const TURTLE_HUE = 168;

export const PEN_COLORS: readonly (readonly [label: string, hex: string])[] = [
  ["amber", "#fbbf24"],
  ["red", "#f87171"],
  ["emerald", "#34d399"],
  ["sky", "#38bdf8"],
  ["violet", "#a78bfa"],
  ["pink", "#f472b6"],
  ["white", "#f5f5f4"],
];

export function defineTurtleBlocks(): void {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "turtle_move",
      message0: "move %1 %2 px",
      args0: [
        {
          type: "field_dropdown",
          name: "DIR",
          options: [
            ["forward", "FORWARD"],
            ["backward", "BACKWARD"],
          ],
        },
        { type: "input_value", name: "DISTANCE", check: "Number" },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: TURTLE_HUE,
      tooltip: "Move the turtle in the direction it is facing.",
      helpUrl: "",
    },
    {
      type: "turtle_turn",
      message0: "turn %1 %2 °",
      args0: [
        {
          type: "field_dropdown",
          name: "DIR",
          options: [
            ["right ↻", "RIGHT"],
            ["left ↺", "LEFT"],
          ],
        },
        { type: "input_value", name: "DEGREES", check: "Number" },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: TURTLE_HUE,
      tooltip: "Rotate the turtle in place.",
      helpUrl: "",
    },
    {
      type: "turtle_pen",
      message0: "pen %1",
      args0: [
        {
          type: "field_dropdown",
          name: "STATE",
          options: [
            ["down ✎", "DOWN"],
            ["up", "UP"],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: TURTLE_HUE,
      tooltip: "Pen down draws while moving; pen up moves silently.",
      helpUrl: "",
    },
    {
      type: "turtle_color",
      message0: "set color %1",
      args0: [
        {
          type: "field_dropdown",
          name: "COLOR",
          options: PEN_COLORS.map(([label, hex]) => [label, hex] as [string, string]),
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: TURTLE_HUE,
      tooltip: "Change the pen color for the lines that follow.",
      helpUrl: "",
    },
    {
      type: "turtle_width",
      message0: "set width %1 px",
      args0: [{ type: "input_value", name: "WIDTH", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: TURTLE_HUE,
      tooltip: "Change the pen thickness for the lines that follow.",
      helpUrl: "",
    },
  ]);

  javascriptGenerator.forBlock["turtle_move"] = (block, generator) => {
    const distance = generator.valueToCode(block, "DISTANCE", Order.NONE) || "0";
    const fn = block.getFieldValue("DIR") === "BACKWARD" ? "moveBackward" : "moveForward";
    return `${fn}(${distance});\n`;
  };

  javascriptGenerator.forBlock["turtle_turn"] = (block, generator) => {
    const degrees = generator.valueToCode(block, "DEGREES", Order.NONE) || "0";
    const fn = block.getFieldValue("DIR") === "LEFT" ? "turnLeft" : "turnRight";
    return `${fn}(${degrees});\n`;
  };

  javascriptGenerator.forBlock["turtle_pen"] = (block) => {
    return block.getFieldValue("STATE") === "UP" ? "penUp();\n" : "penDown();\n";
  };

  javascriptGenerator.forBlock["turtle_color"] = (block) => {
    const hex = String(block.getFieldValue("COLOR"));
    return `setColor('${hex}');\n`;
  };

  javascriptGenerator.forBlock["turtle_width"] = (block, generator) => {
    const width = generator.valueToCode(block, "WIDTH", Order.NONE) || "1";
    return `setWidth(${width});\n`;
  };
}
