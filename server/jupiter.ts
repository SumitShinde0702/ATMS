/**
 * Fetch + parse helper with retry for Jupiter API.
 * ECONNRESET is common on Windows; retrying often succeeds.
 */
const RETRIABLE = ["ECONNRESET", "ETIMEDOUT", "EPIPE", "ENOTFOUND", "ECONNREFUSED"];
const MAX_RETRIES = 3;

function isRetriable(e: unknown): boolean {
  const cause = e instanceof Error && e.cause instanceof Error ? (e.cause as NodeJS.ErrnoException) : e;
  const err = cause as NodeJS.ErrnoException;
  const code = err?.code ?? "";
  const msg = String(err?.message ?? e ?? "");
  return RETRIABLE.some((c) => code === c || msg.includes(c));
}

export async function jupiterFetch<T = unknown>(
  url: string,
  opts: RequestInit & { retries?: number } = {}
): Promise<{ res: Response; data: T }> {
  const { retries = MAX_RETRIES, ...fetchOpts } = opts;
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, fetchOpts);
      const data = (await res.json()) as T;
      return { res, data };
    } catch (e) {
      lastErr = e;
      if (i < retries && isRetriable(e)) {
        const delay = Math.min(1000 * Math.pow(2, i), 4000);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}
