export interface ServerOptions {
  port: number;
  cwd?: string;
  /** Path polled for readiness. Any response (even 404/500) means the server is up. */
  readyPath?: string;
  timeoutMs?: number;
}

export interface ServerHandle {
  url: string;
  stop(): Promise<void>;
  /** Captured stdout+stderr so far — useful when readiness times out. */
  output(): string;
}

/**
 * Spawn a dev server and resolve once its port answers HTTP.
 * `stop()` kills the process and, as a fallback, anything still
 * listening on the port (dev servers often orphan child processes).
 */
export async function startServer(
  command: string,
  options: ServerOptions,
): Promise<ServerHandle> {
  const { port, cwd, readyPath = "/", timeoutMs = 30_000 } = options;
  const url = `http://localhost:${port}`;

  const chunks: string[] = [];
  const proc = Bun.spawn(["sh", "-c", command], {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, PORT: String(port) },
  });
  const collect = async (stream: ReadableStream<Uint8Array>) => {
    const decoder = new TextDecoder();
    for await (const chunk of stream) chunks.push(decoder.decode(chunk));
  };
  void collect(proc.stdout);
  void collect(proc.stderr);

  const handle: ServerHandle = {
    url,
    output: () => chunks.join(""),
    stop: async () => {
      proc.kill();
      await Promise.race([proc.exited, Bun.sleep(2_000)]);
      // Orphaned children (e.g. vite spawned by a package manager) can
      // keep the port open — sweep it.
      await Bun.$`sh -c "lsof -t -i :${port} -sTCP:LISTEN | xargs -r kill" 2>/dev/null`
        .nothrow()
        .quiet();
    },
  };

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(
        `Server exited with code ${proc.exitCode} before becoming ready.\n${handle.output()}`,
      );
    }
    try {
      await fetch(new URL(readyPath, url), { signal: AbortSignal.timeout(1_000) });
      return handle;
    } catch {
      await Bun.sleep(250);
    }
  }
  await handle.stop();
  throw new Error(
    `Server did not answer on port ${port} within ${timeoutMs}ms.\n${handle.output()}`,
  );
}
