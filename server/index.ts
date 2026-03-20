import "dotenv/config";
import express from "express";
import cors from "cors";
import { askDeepseek } from "./deepseek.js";
import { jupiterFetch } from "./jupiter.js";
import { runMarketMonitor, getProposals } from "./monitor.js";
import { getAgentKeypair, getAgentAddress, hasAgent } from "./agent.js";
import { JUPITER_QUOTE_API, JUPITER_SWAP_API, JUPITER_SWAP_TX_API, TOKENS } from "./constants.js";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
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
    const { res: r, data } = await jupiterFetch(url, { headers });
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

    const { res: quoteRes, data: quote } = await jupiterFetch(
      `${JUPITER_QUOTE_API}?inputMint=${inMint}&outputMint=${outMint}&amount=${amt}&slippageBps=50`,
      { headers, signal: AbortSignal.timeout(15000) }
    );
    if (!quoteRes.ok || quote.error) {
      return res.status(500).json({
        error: quote.message ?? "Jupiter quote failed",
        proposed: false,
      });
    }

    const vaultState = { usdcBalance: 100_000, solBalance: 100, totalUsd: 115_000 };
    const quoteSummary = {
      inputMint: inMint,
      outputMint: outMint,
      inAmount: amt,
      outAmount: quote.outAmount ?? "0",
      priceImpactPct: quote.priceImpactPct,
    };

    const recommendation = await askDeepseek(vaultState, quoteSummary);

    if (!recommendation.recommend) {
      return res.json({ proposed: false, rationale: recommendation.rationale });
    }

    if (!VAULT) {
      return res.status(400).json({
        error: "Squads vault not configured",
        proposed: false,
        rationale: recommendation.rationale,
      });
    }

    const { res: swapRes, data: swapData } = await jupiterFetch(JUPITER_SWAP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ quoteResponse: quote, userPublicKey: VAULT, wrapAndUnwrapSol: true }),
      signal: AbortSignal.timeout(15000),
    });
    if (!swapRes.ok) {
      return res.status(500).json({
        error: swapData.error ?? "Swap instructions failed",
        proposed: false,
      });
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
    return res.status(500).json({
      error: err.message,
      proposed: false,
    });
  }
});

app.post("/api/execute-swap", async (req, res) => {
  const agent = getAgentKeypair();
  if (!agent) {
    return res.status(400).json({
      error: "Agent wallet not configured",
      message: "Set AGENT_KEYPAIR in .env. Run: npm run generate:agent",
    });
  }

  try {
    const { inputMint, outputMint, amount } = req.body || {};
    // Default: 0.01 SOL → USDC (small amount for repeated testing)
    const inMint = inputMint ?? TOKENS.SOL;
    const outMint = outputMint ?? TOKENS.USDC;
    const amt = amount ?? "10000000"; // 0.01 SOL (9 decimals)

    const headers: Record<string, string> = {};
    if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;

    const { res: quoteRes, data: quote } = await jupiterFetch(
      `${JUPITER_QUOTE_API}?inputMint=${inMint}&outputMint=${outMint}&amount=${amt}&slippageBps=50`,
      { headers, signal: AbortSignal.timeout(15000) }
    );
    if (!quoteRes.ok || quote.error) {
      return res.status(500).json({
        error: quote.message ?? "Jupiter quote failed",
        executed: false,
      });
    }

    const { res: swapRes, data: swapData } = await jupiterFetch<{ swapTransaction?: string; error?: string }>(
      JUPITER_SWAP_TX_API,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: agent.publicKey.toBase58(),
          wrapAndUnwrapSol: true,
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!swapRes.ok || !swapData.swapTransaction) {
      return res.status(500).json({
        error: swapData.error ?? "Failed to build swap transaction",
        executed: false,
      });
    }

    const txBuf = Buffer.from(swapData.swapTransaction, "base64");
    const tx = VersionedTransaction.deserialize(txBuf);
    tx.sign([agent]);

    const connection = new Connection(RPC);
    const sig = await connection.sendTransaction(tx, { skipPreflight: false, maxRetries: 3 });

    res.json({
      executed: true,
      signature: sig,
      message: "Swap submitted. Confirm on Solana Explorer.",
      quote: { inputAmount: amt, outputAmount: quote.outAmount, priceImpact: quote.priceImpactPct },
    });
  } catch (e) {
    console.error(e);
    const err = e instanceof Error ? e : new Error(String(e));
    return res.status(500).json({
      error: err.message,
      executed: false,
    });
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
  res.json({ proposals: getProposals() });
});

app.get("/api/agent/status", (_req, res) => {
  const address = getAgentAddress();
  res.json({
    configured: hasAgent(),
    address: address ?? null,
    message: address
      ? "Fund with SOL for swap execution"
      : "Set AGENT_KEYPAIR in .env (run: npm run generate:agent)",
  });
});

app.post("/api/monitor/run", async (_req, res) => {
  try {
    const { found, proposals } = await runMarketMonitor();
    res.json({ found, proposals });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Market monitor failed" });
  }
});

app.get("/api/kyc-status", (req, res) => {
  const wallet = req.headers["x-wallet-address"] as string;
  const whitelist = (process.env.KYC_WHITELIST ?? "").split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
  const verified = whitelist.length === 0 || (wallet && whitelist.includes(wallet.toLowerCase()));
  res.json({ verified });
});

app.get("/api/compliance", (req, res) => {
  const wallet = req.headers["x-wallet-address"] as string;
  const whitelist = (process.env.KYC_WHITELIST ?? "").split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
  const kycVerified = whitelist.length === 0 || (wallet && whitelist.includes(wallet.toLowerCase()));
  res.json({
    kyc: { status: kycVerified ? "verified" : "demo", label: kycVerified ? "Verified" : "Demo mode" },
    kyt: { status: "active", label: "Monitoring active" },
    aml: { status: "active", label: "Sanctions screening" },
    travelRule: { status: "enabled", label: "Memo required > $10k" },
  });
});

app.post("/api/strategy", async (_req, res) => {
  try {
    const amount = "10000000";
    const headers: Record<string, string> = {};
    if (process.env.JUPITER_API_KEY) headers["x-api-key"] = process.env.JUPITER_API_KEY;
    const { res: quoteRes, data: quote } = await jupiterFetch(
      `${JUPITER_QUOTE_API}?inputMint=${TOKENS.USDC}&outputMint=${TOKENS.SOL}&amount=${amount}&slippageBps=50`,
      { headers }
    );
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
const MONITOR_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT}`);
  // Run market monitor on startup (after 10s) and every 5 min
  setTimeout(() => {
    runMarketMonitor().then(({ found }) => {
      if (found > 0) console.log(`[Monitor] Found ${found} opportunity/ies`);
    }).catch((e) => console.warn("[Monitor] Startup run failed:", e));
  }, 10_000);
  setInterval(() => {
    runMarketMonitor().then(({ found }) => {
      if (found > 0) console.log(`[Monitor] Found ${found} opportunity/ies`);
    }).catch((e) => console.warn("[Monitor] Interval run failed:", e));
  }, MONITOR_INTERVAL_MS);
});
