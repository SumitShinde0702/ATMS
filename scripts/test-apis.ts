/**
 * Test script for Jupiter and Deepseek APIs.
 * Run: npx tsx scripts/test-apis.ts
 * Or: npm run test:apis (add script to package.json)
 */
import "dotenv/config";
import { JUPITER_QUOTE_API } from "../server/constants.js";
import { jupiterFetch } from "../server/jupiter.js";
import { askDeepseek } from "../server/deepseek.js";

const TOKENS = {
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  SOL: "So11111111111111111111111111111111111111112",
} as const;

async function testJupiter(): Promise<{ ok: boolean; error?: string; data?: unknown }> {
  console.log("\n--- Testing Jupiter API ---");
  const url = `${JUPITER_QUOTE_API}?inputMint=${TOKENS.USDC}&outputMint=${TOKENS.SOL}&amount=1000000&slippageBps=50`;
  const headers: Record<string, string> = {};
  if (process.env.JUPITER_API_KEY) {
    headers["x-api-key"] = process.env.JUPITER_API_KEY;
    console.log("Using JUPITER_API_KEY");
  } else {
    console.log("No JUPITER_API_KEY (Jupiter may rate-limit or reject)");
  }

  try {
    const { res, data } = await jupiterFetch<{ outAmount?: string; priceImpactPct?: string; error?: string; message?: string }>(
      url,
      { headers, signal: AbortSignal.timeout(15000) }
    );

    if (!res.ok) {
      return { ok: false, error: data.message ?? `HTTP ${res.status}` };
    }
    if (data.error) {
      return { ok: false, error: data.message ?? data.error };
    }

    console.log("Jupiter OK – outAmount:", data.outAmount, "priceImpactPct:", data.priceImpactPct);
    return { ok: true, data };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const cause = err.cause instanceof Error ? String(err.cause) : "";
    return {
      ok: false,
      error: `${err.message}${cause ? ` (${cause})` : ""}`,
    };
  }
}

async function testDeepseek(): Promise<{ ok: boolean; error?: string; data?: unknown }> {
  console.log("\n--- Testing Deepseek API ---");
  if (!process.env.DEEPSEEK_API_KEY) {
    return { ok: false, error: "DEEPSEEK_API_KEY not set" };
  }
  console.log("DEEPSEEK_API_KEY set");

  const vaultState = { usdcBalance: 100_000, solBalance: 100, totalUsd: 115_000 };
  const quoteSummary = {
    inputMint: TOKENS.USDC,
    outputMint: TOKENS.SOL,
    inAmount: "1000000",
    outAmount: "0.9995",
    priceImpactPct: "0.05",
  };

  try {
    const rec = await askDeepseek(vaultState, quoteSummary);
    console.log("Deepseek OK – recommend:", rec.recommend, "rationale:", rec.rationale?.slice(0, 80) + "...");
    return { ok: true, data: rec };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log("ATMS API connectivity test");
  console.log("Loading .env from project root");

  const jupiter = await testJupiter();
  const deepseek = await testDeepseek();

  console.log("\n--- Summary ---");
  console.log("Jupiter:", jupiter.ok ? "OK" : "FAIL –", jupiter.error);
  console.log("Deepseek:", deepseek.ok ? "OK" : "FAIL –", deepseek.error);

  if (!jupiter.ok || !deepseek.ok) {
    process.exit(1);
  }
}

main();
