/**
 * Minimal typings for the `js-interpreter` npm package (Neil Fraser's
 * JS-Interpreter, webpack-bundled with acorn). The package ships no types;
 * this covers the surface karakuri uses.
 */
declare module "js-interpreter" {
  /** Opaque value living inside the interpreter's sandbox. */
  export interface InterpreterObject {
    readonly __isInterpreterObject?: never;
  }

  export default class Interpreter {
    constructor(
      code: string,
      initFunc?: (interpreter: Interpreter, globalObject: InterpreterObject) => void,
    );

    /** Execute one micro-step. Returns true while more steps remain. */
    step(): boolean;
    /** Run to completion (or until blocked on async). Returns true if blocked. */
    run(): boolean;
    /** Result value of the last executed statement. */
    value: unknown;

    createNativeFunction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fn: (...args: any[]) => unknown,
      isConstructor?: boolean,
    ): InterpreterObject;
    setProperty(obj: InterpreterObject, name: string, value: unknown): void;
    getProperty(obj: InterpreterObject, name: string): unknown;
    nativeToPseudo(value: unknown): unknown;
    pseudoToNative(value: unknown): unknown;
    appendCode(code: string): void;
  }
}
