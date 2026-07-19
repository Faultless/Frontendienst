import type { Page } from "playwright";

export interface RuntimeErrors {
  pageErrors: string[];
  consoleErrors: string[];
  failedRequests: string[];
}

/**
 * Attach error collectors to a page. Must be called BEFORE page.goto —
 * load-time errors are the ones that matter most.
 */
export function attachErrorCollector(page: Page): RuntimeErrors {
  const errors: RuntimeErrors = {
    pageErrors: [],
    consoleErrors: [],
    failedRequests: [],
  };
  page.on("pageerror", (err) => {
    errors.pageErrors.push(err.stack ?? err.message);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.consoleErrors.push(msg.text());
    }
  });
  page.on("requestfailed", (req) => {
    const failure = req.failure()?.errorText ?? "unknown failure";
    // Aborted requests are routine (HMR, cancelled navigations) — skip.
    if (failure.includes("ERR_ABORTED")) return;
    errors.failedRequests.push(`${req.method()} ${req.url()} — ${failure}`);
  });
  return errors;
}

export function errorCount(errors: RuntimeErrors): number {
  return (
    errors.pageErrors.length +
    errors.consoleErrors.length +
    errors.failedRequests.length
  );
}
