/**
 * Category toolbox: the custom turtle blocks first, then Blockly's built-in
 * loops / math / logic plus the dynamic variables & functions categories —
 * the curriculum's upgrade path (loops → variables → functions) comes free.
 */

const num = (n: number) => ({ shadow: { type: "math_number", fields: { NUM: n } } });

export const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Turtle",
      colour: "#2dd4bf",
      contents: [
        { kind: "block", type: "turtle_move", inputs: { DISTANCE: num(80) } },
        { kind: "block", type: "turtle_turn", inputs: { DEGREES: num(90) } },
        { kind: "block", type: "turtle_pen" },
        { kind: "block", type: "turtle_color" },
        { kind: "block", type: "turtle_width", inputs: { WIDTH: num(3) } },
      ],
    },
    {
      kind: "category",
      name: "Loops",
      categorystyle: "loop_category",
      contents: [
        { kind: "block", type: "controls_repeat_ext", inputs: { TIMES: num(4) } },
        { kind: "block", type: "controls_whileUntil" },
        {
          kind: "block",
          type: "controls_for",
          inputs: { FROM: num(1), TO: num(5), BY: num(1) },
        },
        { kind: "block", type: "controls_flow_statements" },
      ],
    },
    {
      kind: "category",
      name: "Math",
      categorystyle: "math_category",
      contents: [
        { kind: "block", type: "math_number", fields: { NUM: 0 } },
        { kind: "block", type: "math_arithmetic", inputs: { A: num(1), B: num(1) } },
        { kind: "block", type: "math_single", inputs: { NUM: num(9) } },
        { kind: "block", type: "math_random_int", inputs: { FROM: num(1), TO: num(100) } },
      ],
    },
    {
      kind: "category",
      name: "Logic",
      categorystyle: "logic_category",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_negate" },
        { kind: "block", type: "logic_boolean" },
      ],
    },
    { kind: "sep" },
    { kind: "category", name: "Variables", categorystyle: "variable_category", custom: "VARIABLE" },
    { kind: "category", name: "Functions", categorystyle: "procedure_category", custom: "PROCEDURE" },
  ],
};
