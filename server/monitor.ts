/**
 * Market monitoring – fetches prices, asks AI for opportunities, stores proposals.
 */
import { askDeepseek } from "./deepseek.js";
import { jupiterFetch } from "./jupiter.js";
import { JUPITER_QUOTE_API, TOKENS } from "./constants.js";

export interface Proposal {
  id: string;
  createdAt: string;
  direction: "USDC→SOL" | "SOL→USDC" | "USDT→SOL" | "SOL→USDT" | "PYUSD→SOL" | "SOL→PYUSD";
  inAmount: string;
  outAmount: string;
  priceImpactPct?: string;
  rationale: string;
  recommend: boolean;
}

const proposals: Proposal[] = [];
const VAULT_STATE = { usdcBalance: 100_000, solBalance: 50, totalUsd: 107_500 };

function genId(): string {
  return `prop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function checkOpportunity(
  direction: "USDC→SOL" | "SOL→USDC",
  inMint: string,
  outMint: string,
  amount: string
): Promise<Proposal | null> {
  const headers: Record<string, string> = {};
  if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;

  try {
    const { res, data: quote } = await jupiterFetch(
      `${JUPITER_QUOTE_API}?inputMint=${inMint}&outputMint=${outMint}&amount=${amount}&slippageBps=50`,
      { headers, signal: AbortSignal.timeout(15000) }
    );

    if (!res.ok || quote.error) return null;

    const quoteSummary = {
      inputMint: inMint,
      outputMint: outMint,
      inAmount: amount,
      outAmount: quote.outAmount ?? "0",
      priceImpactPct: quote.priceImpactPct,
    };

    const rec = await askDeepseek(VAULT_STATE, quoteSummary);

    const proposal: Proposal = {
      id: genId(),
      createdAt: new Date().toISOString(),
      direction,
      inAmount: amount,
      outAmount: quote.outAmount ?? "0",
      priceImpactPct: quote.priceImpactPct,
      rationale: rec.rationale,
      recommend: rec.recommend,
    };

    if (rec.recommend) {
      proposals.unshift(proposal);
      if (proposals.length > 20) proposals.pop();
      return proposal;
    }
    return null;
  } catch {
    return null;
  }
}

const MONITOR_PAIRS: { direction: "USDC→SOL" | "SOL→USDC" | "USDT→SOL" | "SOL→USDT" | "PYUSD→SOL" | "SOL→PYUSD"; inMint: string; outMint: string; amount: string }[] = [
  { direction: "USDC→SOL", inMint: TOKENS.USDC, outMint: TOKENS.SOL, amount: "10000000" },
  { direction: "SOL→USDC", inMint: TOKENS.SOL, outMint: TOKENS.USDC, amount: "1000000000" },
  { direction: "USDT→SOL", inMint: TOKENS.USDT, outMint: TOKENS.SOL, amount: "10000000" },
  { direction: "SOL→USDT", inMint: TOKENS.SOL, outMint: TOKENS.USDT, amount: "1000000000" },
  { direction: "PYUSD→SOL", inMint: TOKENS.PYUSD, outMint: TOKENS.SOL, amount: "10000000" },
  { direction: "SOL→PYUSD", inMint: TOKENS.SOL, outMint: TOKENS.PYUSD, amount: "1000000000" },
];

export async function runMarketMonitor(): Promise<{ found: number; proposals: Proposal[] }> {
  const results = await Promise.all(
    MONITOR_PAIRS.map((p) => checkOpportunity(p.direction, p.inMint, p.outMint, p.amount))
  );
  const found = results.filter(Boolean).length;
  return { found, proposals: getProposals() };
}

const DEMO_OPPORTUNITIES: Omit<Proposal, "id" | "createdAt">[] = [
  { direction: "USDC→SOL", inAmount: "10000000", outAmount: "6700000", priceImpactPct: "0.18", rationale: "Yield opportunity ~0.18%. Favorable spread for treasury rebalancing. Low slippage.", recommend: true },
  { direction: "SOL→USDC", inAmount: "1000000000", outAmount: "152000000", priceImpactPct: "0.15", rationale: "Stablecoin allocation opportunity. Lock in gains with minimal impact.", recommend: true },
  { direction: "USDT→SOL", inAmount: "5000000", outAmount: "3350000", priceImpactPct: "0.12", rationale: "Diversification into SOL. Attractive entry with low price impact.", recommend: true },
];

export async function runMarketMonitorDemo(): Promise<{ found: number; proposals: Proposal[] }> {
  proposals.splice(0, proposals.length);
  for (const opp of DEMO_OPPORTUNITIES) {
    addProposal(opp);
  }
  return { found: DEMO_OPPORTUNITIES.length, proposals: getProposals() };
}

export function getProposals(): Proposal[] {
  return [...proposals];
}

export function addProposal(p: Omit<Proposal, "id" | "createdAt">): Proposal {
  const proposal: Proposal = {
    ...p,
    id: genId(),
    createdAt: new Date().toISOString(),
  };
  proposals.unshift(proposal);
  if (proposals.length > 20) proposals.pop();
  return proposal;
}
