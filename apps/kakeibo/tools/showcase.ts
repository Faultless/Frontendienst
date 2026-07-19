/**
 * Behavioral test + showcase capture: drives the real UI end-to-end
 * (records entries through the New-entry form), asserts zero runtime
 * errors, and screenshots each page with live data for the portfolio.
 *
 * Run from repo root: bun run apps/kakeibo/tools/showcase.ts
 */
import { chromium, type Page } from "playwright";
import { attachErrorCollector, errorCount } from "../../../harness/verify/src/errors";
import { startServer } from "../../../harness/verify/src/server";

const PORT = 5199;
const OUT = "apps/site/public/images/projects/kakeibo";

const SCENARIO = [
  { memo: "Opening balance", amount: "1200", from: /Opening balances/, to: /Checking/ },
  { memo: "July salary", amount: "2800", from: /Salary/, to: /Checking/ },
  { memo: "July rent", amount: "950", from: /Checking/, to: /Rent/ },
  { memo: "Groceries at the market", amount: "85,40", from: /Checking/, to: /Groceries/ },
  { memo: "Dinner with friends", amount: "42,50", from: /Credit card/, to: /Dining/ },
];

async function addEntry(page: Page, entry: (typeof SCENARIO)[number]) {
  await page.getByRole("link", { name: "New entry" }).click();
  await page.getByLabel(/Amount/).fill(entry.amount);
  await page.getByLabel("Memo").fill(entry.memo);
  await page.getByLabel(/moved from/).selectOption({ label: await optionLabel(page, /moved from/, entry.from) });
  await page.getByLabel(/value arrived/).selectOption({ label: await optionLabel(page, /value arrived/, entry.to) });
  await page.getByRole("button", { name: "Record entry" }).click();
  // Submit navigates to the journal; the new memo must be visible there.
  await page.getByText(entry.memo).first().waitFor({ timeout: 5_000 });
}

async function optionLabel(page: Page, select: RegExp, match: RegExp): Promise<string> {
  const options = await page.getByLabel(select).locator("option").allInnerTexts();
  const found = options.find((o) => match.test(o));
  if (!found) throw new Error(`No option matching ${match} (have: ${options.join(", ")})`);
  return found;
}

const server = await startServer(`bunx vite --port ${PORT}`, {
  port: PORT,
  cwd: "apps/kakeibo",
});
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = attachErrorCollector(page);
  await page.goto(server.url, { waitUntil: "load" });
  await page.getByText("kakeibo").first().waitFor();

  for (const entry of SCENARIO) await addEntry(page, entry);

  // Learn page must show a balanced accounting equation from the data.
  await page.getByRole("link", { name: "Learn" }).click();
  await page.getByText("✓ Your books balance").waitFor({ timeout: 5_000 });

  const shots: Array<[string, string]> = [
    ["/", "accounts.png"],
    ["/journal", "journal.png"],
    ["/learn", "learn.png"],
  ];
  for (const [hash, file] of shots) {
    await page.goto(`${server.url}/#${hash}`, { waitUntil: "load" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${file}` });
  }
  // New-entry page in its filled, teaching state.
  await page.getByRole("link", { name: "New entry" }).click();
  await page.getByLabel(/Amount/).fill("64,90");
  await page.getByLabel("Memo").fill("Week of groceries");
  await page.getByLabel(/moved from/).selectOption({ label: await optionLabel(page, /moved from/, /Checking/) });
  await page.getByLabel(/value arrived/).selectOption({ label: await optionLabel(page, /value arrived/, /Groceries/) });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/new-entry.png` });

  if (errorCount(errors) > 0) {
    console.error("Runtime errors during scenario:", JSON.stringify(errors, null, 2));
    process.exit(1);
  }
  console.log(`✓ Scenario passed clean — screenshots in ${OUT}/`);
} finally {
  await browser.close();
  await server.stop();
}
