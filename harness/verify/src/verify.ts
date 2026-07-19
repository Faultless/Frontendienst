import { chromium } from "playwright";
import { attachErrorCollector, errorCount, type RuntimeErrors } from "./errors";
import { startServer, type ServerHandle } from "./server";

export interface VerifyOptions {
  /** URL to verify. Omit when serverCommand + port are given. */
  url?: string;
  /** Dev-server command to spawn first (e.g. "bun run dev"). */
  serverCommand?: string;
  port?: number;
  cwd?: string;
  /** Directory for screenshots/reports. */
  outDir?: string;
  /** Selector that must become visible before the page counts as rendered. */
  waitForSelector?: string;
  /** Extra settle time after load, ms. */
  settleMs?: number;
  viewport?: { width: number; height: number };
}

export interface VerifyReport {
  ok: boolean;
  url: string;
  httpStatus: number | null;
  errors: RuntimeErrors;
  screenshot: string;
  /** Trimmed page text — lets a model sanity-check that real content rendered. */
  textSample: string;
  notes: string[];
}

/** Same idea as fex's capture stabilization: freeze animations for deterministic shots. */
const STABILIZE_CSS = `
  *, *::before, *::after {
    animation-play-state: paused !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`;

/**
 * The loop: (spawn server →) wait ready → open page with error collectors
 * attached pre-navigation → settle → screenshot → report.
 */
export async function verify(options: VerifyOptions): Promise<VerifyReport> {
  const {
    serverCommand,
    port,
    cwd,
    outDir = ".verify",
    waitForSelector,
    settleMs = 500,
    viewport = { width: 1280, height: 800 },
  } = options;

  let server: ServerHandle | undefined;
  if (serverCommand) {
    if (!port) throw new Error("port is required when serverCommand is given");
    server = await startServer(serverCommand, { port, cwd });
  }
  const url = options.url ?? server?.url;
  if (!url) throw new Error("Either url or serverCommand must be given");

  const notes: string[] = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport });
    const errors = attachErrorCollector(page);

    const response = await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    const httpStatus = response?.status() ?? null;
    if (httpStatus && httpStatus >= 400) notes.push(`HTTP ${httpStatus} for ${url}`);

    if (waitForSelector) {
      try {
        await page.waitForSelector(waitForSelector, { state: "visible", timeout: 10_000 });
      } catch {
        notes.push(`waitForSelector "${waitForSelector}" never became visible`);
      }
    }
    await page.evaluate((css) => {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    }, STABILIZE_CSS);
    await page.waitForTimeout(settleMs);

    const screenshot = `${outDir}/verify-${new URL(url).port || "page"}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });

    const textSample = (await page.innerText("body").catch(() => ""))
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 600);

    // Canvas-rendered apps (Phaser games etc.) legitimately have zero DOM
    // text — a visible, non-empty canvas counts as rendered content.
    const canvasCount = await page.evaluate(() => {
      // Walk shadow roots too — Flutter web (flt-glass-pane) and other
      // frameworks render their canvas inside shadow DOM.
      const collect = (root: Document | ShadowRoot): HTMLCanvasElement[] => {
        const found = [...root.querySelectorAll("canvas")] as HTMLCanvasElement[];
        for (const el of root.querySelectorAll("*")) {
          if (el.shadowRoot) found.push(...collect(el.shadowRoot));
        }
        return found;
      };
      return collect(document).filter((c) => {
        const rect = c.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length;
    });
    if (textSample.length === 0) {
      notes.push(
        canvasCount > 0
          ? `No DOM text, but ${canvasCount} visible canvas element(s) — canvas-rendered app`
          : "Page body rendered no text at all",
      );
    }

    const ok =
      errorCount(errors) === 0 &&
      (httpStatus === null || httpStatus < 400) &&
      (textSample.length > 0 || canvasCount > 0);

    return { ok, url, httpStatus, errors, screenshot, textSample, notes };
  } finally {
    await browser.close();
    await server?.stop();
  }
}
