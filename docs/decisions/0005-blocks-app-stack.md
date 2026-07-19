# ADR 0005 — block-programming app stack (karakuri)

Date: 2026-07-19 · Status: accepted

## Context

The harness's second named prototype is a Scratch-style block-programming
app for learning harder programming principles. The build-vs-use question
is really about the block editor itself: a custom canvas editor is a
multi-month project before any teaching happens.

## Decision

- **Editor: Blockly** (Google, Apache-2.0/MIT ecosystem, the engine behind
  most Scratch-alikes). Battle-tested drag-drop, serialization, toolbox
  config, and a JavaScript generator out of the box. A custom editor is
  explicitly rejected for v1 — the teaching content is the product, not
  the editor.
- **Execution: JS-Interpreter** (acorn-based sandbox, the canonical
  Blockly companion). It runs generated code *stepped*, which is the whole
  pedagogical point: block-by-block highlighting, speed slider, pause —
  programs as observable processes, not black boxes. ES5-only output is
  irrelevant since the generator emits it.
- **Stage: turtle graphics on `<canvas>`** — visual, immediate, and scales
  from "draw a square" (loops) through functions to recursion (fractal
  trees) without new machinery.
- **Shell: the web-app blueprint** (Vite + React + TS strict + Tailwind),
  with one sanctioned deviation: Blockly owns its DOM subtree inside a
  ref'd div; React renders only the shell around it (toolbar, lessons,
  stage). No router needed for v1's single screen.
- **Name: karakuri** (からくり) — Edo-period mechanical automata you
  "program" with cams and levers; continues the portfolio's Japan thread.

## Consequences

- `apps/karakuri` workspace; localStorage persistence of the workspace +
  JSON export/import per the web-app skill.
- Lessons are data: a goal description, a starter workspace (Blockly JSON),
  and a validator over the turtle's path/canvas.
- Block highlighting requires generator `STATEMENT_PREFIX` wiring — the
  spike must prove Blockly ↔ interpreter ↔ highlight integration early.
