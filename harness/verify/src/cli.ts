import { verify, type VerifyOptions } from "./verify";

function usage(): never {
  console.log(`Usage:
  bun run verify -- <url> [flags]
  bun run verify -- --cmd "bun run dev" --port 5173 [--cwd apps/kakeibo] [flags]

Flags:
  --selector <css>   selector that must become visible
  --settle <ms>      extra settle time after load (default 500)
  --out <dir>        output dir for screenshots (default .verify)
  --json             print the full JSON report only

Exit code 0 = page loaded with zero runtime errors.`);
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help")) usage();

const opts: VerifyOptions = {};
let jsonOnly = false;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case "--cmd":
      opts.serverCommand = args[++i];
      break;
    case "--port":
      opts.port = Number(args[++i]);
      break;
    case "--cwd":
      opts.cwd = args[++i];
      break;
    case "--selector":
      opts.waitForSelector = args[++i];
      break;
    case "--settle":
      opts.settleMs = Number(args[++i]);
      break;
    case "--out":
      opts.outDir = args[++i];
      break;
    case "--json":
      jsonOnly = true;
      break;
    default:
      if (arg?.startsWith("http")) opts.url = arg;
      else usage();
  }
}

const report = await verify(opts);

if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(JSON.stringify(report, null, 2));
  console.log(
    report.ok
      ? `\n✓ ${report.url} verified clean — screenshot at ${report.screenshot}`
      : `\n✗ ${report.url} has problems — see report above`,
  );
}
process.exit(report.ok ? 0 : 1);
