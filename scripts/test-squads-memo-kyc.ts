/**
 * Test script for Squads, Memo, and KYC features.
 * Requires server running: npm run dev:server (or npm run dev)
 * Run: npm run test:squads
 */
import "dotenv/config";

const BASE = process.env.API_BASE ?? "http://localhost:3001";

async function fetchApi(
  path: string,
  opts?: { method?: string; body?: unknown; headers?: Record<string, string> }
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const res = await fetch(`${BASE}${path}`, {
    method: opts?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...opts?.headers,
    },
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = await res.text();
  }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log("ATMS – Squads / Memo / KYC test");
  console.log("Base URL:", BASE);
  console.log("");

  // 1. Agent status
  const agent = await fetchApi("/api/agent/status");
  console.log("1. Agent status:", agent.ok ? "OK" : `FAIL (${agent.status})`);
  if (agent.ok && typeof agent.data === "object" && agent.data !== null && "configured" in agent.data) {
    console.log("   configured:", (agent.data as { configured: boolean }).configured);
    console.log("   address:", (agent.data as { address: string | null }).address ?? "—");
  }
  console.log("");

  // 2. Vault balances
  const vault = await fetchApi("/api/vault/balances");
  console.log("2. Vault balances:", vault.ok ? "OK" : `FAIL (${vault.status})`);
  if (vault.ok && typeof vault.data === "object" && vault.data !== null) {
    const d = vault.data as { usdc?: number; sol?: number; totalUsd?: number };
    console.log("   usdc:", d.usdc ?? "—", "| sol:", d.sol ?? "—", "| totalUsd:", d.totalUsd ?? "—");
  }
  console.log("");

  // 3. Compliance
  const compliance = await fetchApi("/api/compliance");
  console.log("3. Compliance:", compliance.ok ? "OK" : `FAIL (${compliance.status})`);
  if (compliance.ok && typeof compliance.data === "object" && compliance.data !== null) {
    const d = compliance.data as { kyc?: { status?: string }; travelRule?: { status?: string } };
    console.log("   kyc:", d.kyc?.status ?? "—", "| travelRule:", d.travelRule?.status ?? "—");
  }
  console.log("");

  // 4. KYC status (no wallet)
  const kycNoWallet = await fetchApi("/api/kyc-status");
  console.log("4. KYC status (no wallet):", kycNoWallet.ok ? "OK" : `FAIL (${kycNoWallet.status})`);
  if (kycNoWallet.ok && typeof kycNoWallet.data === "object" && kycNoWallet.data !== null) {
    console.log("   verified:", (kycNoWallet.data as { verified: boolean }).verified);
  }
  console.log("");

  // 5. Propose-swap (AI may reject; we care about response shape)
  const propose = await fetchApi("/api/propose-swap", {
    method: "POST",
    body: {
      inputMint: "So11111111111111111111111111111111111111112",
      outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: "10000000",
    },
  });
  console.log("5. Propose-swap:", propose.ok ? "OK" : `FAIL (${propose.status})`);
  if (typeof propose.data === "object" && propose.data !== null) {
    const d = propose.data as { proposed?: boolean; message?: string; squads?: { signature?: string } };
    console.log("   proposed:", d.proposed ?? "—");
    console.log("   message:", d.message ?? "—");
    if (d.squads?.signature) console.log("   squads sig:", d.squads.signature);
  }
  if (!propose.ok && typeof propose.data === "object" && propose.data !== null && "error" in propose.data) {
    console.log("   error:", (propose.data as { error: string }).error);
  }
  console.log("");

  // 6. Execute-swap (dry run – may fail if no agent or insufficient balance)
  const execute = await fetchApi("/api/execute-swap", {
    method: "POST",
    body: {
      inputMint: "So11111111111111111111111111111111111111112",
      outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: "10000000",
      memo: "ATMS test script – Travel Rule memo",
    },
  });
  console.log("6. Execute-swap (no KYC header):", execute.ok ? "OK" : `FAIL (${execute.status})`);
  if (typeof execute.data === "object" && execute.data !== null) {
    const d = execute.data as { executed?: boolean; signature?: string; error?: string };
    console.log("   executed:", d.executed ?? "—");
    if (d.signature) console.log("   signature:", d.signature);
    if (d.error) console.log("   error:", d.error);
  }
  console.log("");

  // 7. Execute-swap with KYC header (when KYC_WHITELIST is set)
  const whitelist = (process.env.KYC_WHITELIST ?? "").split(",").map((w) => w.trim()).filter(Boolean);
  if (whitelist.length > 0) {
    const executeKyc = await fetchApi("/api/execute-swap", {
      method: "POST",
      body: { amount: "10000000" },
      headers: { "x-wallet-address": whitelist[0] },
    });
    console.log("7. Execute-swap (with KYC header):", executeKyc.ok ? "OK" : `FAIL (${executeKyc.status})`);
    if (typeof executeKyc.data === "object" && executeKyc.data !== null) {
      const d = executeKyc.data as { executed?: boolean; error?: string };
      console.log("   executed:", d.executed ?? "—");
      if (d.error) console.log("   error:", d.error);
    }
    console.log("");
  } else {
    console.log("7. Execute-swap (KYC): SKIP – KYC_WHITELIST not set");
    console.log("");
  }

  // 8. Proposals
  const proposals = await fetchApi("/api/proposals");
  console.log("8. Proposals:", proposals.ok ? "OK" : `FAIL (${proposals.status})`);
  if (proposals.ok && typeof proposals.data === "object" && proposals.data !== null && "proposals" in proposals.data) {
    const list = (proposals.data as { proposals: unknown[] }).proposals;
    console.log("   count:", list?.length ?? 0);
  }
  console.log("");

  console.log("--- Done ---");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
