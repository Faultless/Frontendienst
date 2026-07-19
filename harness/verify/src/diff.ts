import { readFileSync, writeFileSync } from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export interface DiffResult {
  diffPixels: number;
  totalPixels: number;
  diffRatio: number;
  passed: boolean;
}

export interface DiffOptions {
  /** Per-pixel color threshold (pixelmatch), default 0.1. */
  threshold?: number;
  /** Max fraction of differing pixels to still pass, default 0.001. */
  failRatio?: number;
}

/** Compare two same-size PNGs, write a diff image, return pass/fail. */
export function diffImages(
  pathA: string,
  pathB: string,
  outDiffPath: string,
  options: DiffOptions = {},
): DiffResult {
  const { threshold = 0.1, failRatio = 0.001 } = options;
  const a = PNG.sync.read(readFileSync(pathA));
  const b = PNG.sync.read(readFileSync(pathB));
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(
      `Image sizes differ: ${a.width}x${a.height} vs ${b.width}x${b.height}`,
    );
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold,
  });
  writeFileSync(outDiffPath, PNG.sync.write(diff));
  const totalPixels = a.width * a.height;
  const diffRatio = diffPixels / totalPixels;
  return { diffPixels, totalPixels, diffRatio, passed: diffRatio <= failRatio };
}
