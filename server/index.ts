import "dotenv/config";
import express from "express";
import cors from "cors";
import { askDeepseek } from "./deepseek.js";
import { JUPITER_QUOTE_API, JUPITER_SWAP_API, TOKENS } from "./constants.js";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

const app = express();
app.use(cors());
app.use(express.json());

const VAULT = process.env.VITE_SQUADS_VAULT ?? process.env.SQUADS_VAULT ?? "";
const RPC = process.env.VITE_SOLANA_RPC ?? process.env.SOLANA_RPC ?? "https://api.devnet.solana.com";

app.get("/api/quote", async (req, res) => {
  const { inputMint, outputMint, amount, slippageBps = "50" } = req.query;
  if (!inputMint || !outputMint || !amount) {
    return res.status(400).json({ error: "Missing inputMint, outputMint, or amount" });
  }
  const headers: Record<string, string> = {};
  if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;
  try {
    const url = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
    const r = await fetch(url, { headers });
    const data = await r.json();
    res.status(r.ok ? 200 : r.status).json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

app.post("/api/propose-swap", async (req, res) => {
  try {
    const { inputMint, outputMint, amount } = req.body || {};
    const inMint = inputMint ?? TOKENS.USDC;
    const outMint = outputMint ?? TOKENS.SOL;
    const amt = amount ?? "1000000";

    const headers: Record<string, string> = {};
    if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;

    const quoteRes = await fetch(
      `${JUPITER_QUOTE_API}?inputMint=${inMint}&outputMint=${outMint}&amount=${amt}&slippageBps=50`,
      { headers }
    );
    const quote = await quoteRes.json();

    if (!quoteRes.ok || quote.error) {
      return res.status(400).json({ error: quote.message ?? "Failed to get quote" });
    }

    const vaultState = { usdcBalance: 100_000, solBalance: 100, totalUsd: 115_000 };
    const quoteSummary = {
      inputMint: inMint,
      outputMint: outMint,
      inAmount: quote.inputMint ?? amt,
      outAmount: quote.outAmount ?? "0",
      priceImpactPct: quote.priceImpactPct,
    };

    const recommendation = await askDeepseek(vaultState, quoteSummary);

    if (!recommendation.recommend) {
      return res.json({ proposed: false, rationale: recommendation.rationale });
    }

    if (!VAULT) {
      return res.json({
        proposed: false,
        rationale: recommendation.rationale,
        message: "Squads vault not configured.",
      });
    }

    const swapRes = await fetch(JUPITER_SWAP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ quoteResponse: quote, userPublicKey: VAULT, wrapAndUnwrapSol: true }),
    });
    const swapData = await swapRes.json();
    if (!swapRes.ok) {
      return res.status(400).json({ error: swapData.error ?? "Failed to get swap instructions" });
    }

    res.json({
      proposed: true,
      rationale: recommendation.rationale,
      message: "Squads SDK integration pending.",
      quote: { inputAmount: amt, outputAmount: quote.outAmount, priceImpact: quote.priceImpactPct },
    });
  } catch (e) {
    console.error(e);
    const err = e instanceof Error ? e : new Error(String(e));
    const cause = err.cause instanceof Error ? err.cause.message : "";
    const msg = err.message?.includes("fetch") || cause.includes("ENOTFOUND")
      ? "Jupiter API unreachable. Add JUPITER_API_KEY to .env"
      : "Internal server error";
    res.status(500).json({ error: msg });
  }
});

app.get("/api/vault/balances", async (_req, res) => {
  if (!VAULT) {
    return res.json({ usdc: 100_000, sol: 50, totalUsd: 107_500 });
  }
  const connection = new Connection(RPC);
  const vault = new PublicKey(VAULT);
  try {
    let usdcBalance = 0;
    let solBalance = 0;
    const isDevnet = RPC.includes("devnet");
    const usdcMint = isDevnet ? TOKENS.USDC_DEVNET : TOKENS.USDC;
    try {
      const usdcAta = await getAssociatedTokenAddress(new PublicKey(usdcMint), vault);
      const acc = await getAccount(connection, usdcAta);
      usdcBalance = Number(acc.amount) / 1e6;
    } catch {}
    try {
      const info = await connection.getAccountInfo(vault);
      if (info) solBalance = info.lamports / 1e9;
    } catch {}
    const totalUsd = usdcBalance + solBalance * 150;
    res.json({ usdc: usdcBalance, sol: solBalance, totalUsd });
  } catch {
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

app.get("/api/proposals", (_req, res) => {
  res.json({ proposals: [] });
});

app.get("/api/kyc-status", (req, res) => {
  const wallet = req.headers["x-wallet-address"] as string;
  const whitelist = (process.env.KYC_WHITELIST ?? "").split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
  const verified = whitelist.length === 0 || (wallet && whitelist.includes(wallet.toLowerCase()));
  res.json({ verified });
});

app.post("/api/strategy", async (_req, res) => {
  try {
    const amount = "10000000";
    const headers: Record<string, string> = {};
    if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;
    const quoteRes = await fetch(
      `${JUPITER_QUOTE_API}?inputMint=${TOKENS.USDC}&outputMint=${TOKENS.SOL}&amount=${amount}&slippageBps=50`,
      { headers }
    );
    const quote = await quoteRes.json();
    if (!quoteRes.ok || quote.error) {
      return res.status(400).json({ error: quote.message ?? "Failed to get quote" });
    }
    const vaultState = { usdcBalance: 100_000, solBalance: 50, totalUsd: 107_500 };
    const recommendation = await askDeepseek(vaultState, {
      inputMint: TOKENS.USDC,
      outputMint: TOKENS.SOL,
      inAmount: amount,
      outAmount: quote.outAmount ?? "0",
      priceImpactPct: quote.priceImpactPct,
    });
    res.json({
      recommend: recommendation.recommend,
      amountPercent: recommendation.amountPercent,
      rationale: recommendation.rationale,
      quote: { inAmount: amount, outAmount: quote.outAmount, priceImpact: quote.priceImpactPct },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API server http://localhost:${PORT}`));
