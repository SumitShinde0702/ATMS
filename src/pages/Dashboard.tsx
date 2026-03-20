import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Providers } from "@/components/Providers";

interface VaultBalances {
  usdc: number;
  sol: number;
  totalUsd: number;
}

interface ComplianceStatus {
  kyc: { status: string; label: string };
  kyt: { status: string; label: string };
  aml: { status: string; label: string };
  travelRule: { status: string; label: string };
}

interface Proposal {
  id: string;
  createdAt: string;
  direction: "USDC→SOL" | "SOL→USDC" | "USDT→SOL" | "SOL→USDT" | "PYUSD→SOL" | "SOL→PYUSD";
  inAmount: string;
  outAmount: string;
  priceImpactPct?: string;
  rationale: string;
  recommend: boolean;
}

function DashboardContent() {
  const { ready, authenticated, logout, user } = usePrivy();
  const navigate = useNavigate();
  const [balances, setBalances] = useState<VaultBalances | null>(null);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [proposeLoading, setProposeLoading] = useState(false);
  const [proposeResult, setProposeResult] = useState<{
    proposed: boolean;
    rationale?: string;
    message?: string;
  } | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<{ configured: boolean; address: string | null; message: string } | null>(null);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<{ executed: boolean; signature?: string; error?: string } | null>(null);

  const fetchBalances = useCallback(async () => {
    const res = await fetch("/api/vault/balances");
    const data = await res.json();
    if (res.ok) setBalances(data);
  }, []);

  const fetchAgentStatus = useCallback(async () => {
    const res = await fetch("/api/agent/status");
    const data = await res.json();
    if (res.ok) setAgentStatus(data);
  }, []);

  const fetchProposals = useCallback(async () => {
    setProposalsLoading(true);
    try {
      const res = await fetch("/api/proposals");
      const data = await res.json();
      if (res.ok) setProposals(data.proposals ?? []);
    } finally {
      setProposalsLoading(false);
    }
  }, []);

  const fetchCompliance = useCallback(async () => {
    const wallet = user?.wallet?.address ?? user?.linkedAccounts?.find((a) => a.type === "wallet")?.address;
    const res = await fetch("/api/compliance", {
      headers: wallet ? { "x-wallet-address": wallet } : {},
    });
    const data = await res.json();
    if (res.ok) setCompliance(data);
  }, [user]);

  useEffect(() => {
    if (ready && !authenticated) {
      navigate("/login", { replace: true });
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  useEffect(() => {
    fetchAgentStatus();
  }, [fetchAgentStatus]);

  useEffect(() => {
    if (ready && authenticated) fetchCompliance();
  }, [ready, authenticated, fetchCompliance]);

  const handleExecuteSwap = async () => {
    setExecuteLoading(true);
    setExecuteResult(null);
    try {
      const res = await fetch("/api/execute-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputMint: "So11111111111111111111111111111111111111112",
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          amount: "10000000",
        }),
      });
      const data = await res.json();
      setExecuteResult({ executed: data.executed, signature: data.signature, error: data.error });
      if (data.executed) fetchBalances();
    } catch {
      setExecuteResult({ executed: false, error: "Request failed" });
    } finally {
      setExecuteLoading(false);
    }
  };

  const handleRunMonitor = async () => {
    setMonitorLoading(true);
    try {
      const res = await fetch("/api/monitor/run", { method: "POST" });
      const data = await res.json();
      if (res.ok) setProposals(data.proposals ?? []);
    } finally {
      setMonitorLoading(false);
    }
  };

  const handleProposeSwap = async () => {
    setProposeLoading(true);
    setProposeResult(null);
    try {
      const res = await fetch("/api/propose-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputMint: "So11111111111111111111111111111111111111112",
          amount: "1000000",
        }),
      });
      const data = await res.json();
      setProposeResult(data);
      if (data.proposed) fetchBalances();
    } catch {
      setProposeResult({ proposed: false, rationale: "Request failed" });
    } finally {
      setProposeLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <span className="text-xl text-slate-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8 md:p-12">
      <header className="mb-14 flex items-center justify-between border-b border-slate-800 pb-8">
        <Link to="/dashboard" className="text-2xl font-bold tracking-tight text-white">
          ATMS
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/dashboard" className="text-lg text-slate-400 transition hover:text-white">
            Dashboard
          </Link>
          <Link to="/deposit" className="text-lg text-slate-400 transition hover:text-white">
            Deposit
          </Link>
          <button onClick={() => logout()} className="text-lg text-slate-400 transition hover:text-white">
            Logout
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Compliance Status */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="mb-6 text-lg font-semibold uppercase tracking-wider text-slate-500">
            Compliance Status
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {compliance ? (
              <>
                <ComplianceBadge name="KYC" {...compliance.kyc} />
                <ComplianceBadge name="KYT" {...compliance.kyt} />
                <ComplianceBadge name="AML" {...compliance.aml} />
                <ComplianceBadge name="Travel Rule" {...compliance.travelRule} />
              </>
            ) : (
              <p className="col-span-2 text-lg text-slate-500 sm:col-span-4">Loading compliance...</p>
            )}
          </div>
        </section>

        {/* Vault Balances */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-500">
              Vault Balances
            </h2>
            <button
              onClick={fetchBalances}
              className="text-lg text-slate-500 transition hover:text-cyan-400"
            >
              Refresh
            </button>
          </div>
          {balances ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <BalanceCard
                label="USDC"
                value={balances.usdc.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                subtext="Stablecoin"
              />
              <BalanceCard
                label="SOL"
                value={balances.sol.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                subtext="Native"
              />
              <BalanceCard
                label="Total USD"
                value={`$${balances.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                subtext="Portfolio value"
                highlight
              />
            </div>
          ) : (
            <p className="text-lg text-slate-500">Loading balances...</p>
          )}
        </section>

        {/* Agent Wallet */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="mb-2 text-lg font-semibold uppercase tracking-wider text-slate-500">
            Agent Wallet
          </h2>
          {agentStatus ? (
            <>
              <p className="mb-6 text-lg text-slate-400">
                {agentStatus.configured ? (
                  <>
                    <span className="font-mono text-cyan-400">{agentStatus.address?.slice(0, 8)}...{agentStatus.address?.slice(-8)}</span>
                    {" · "}
                    {agentStatus.message}
                  </>
                ) : (
                  <span className="text-amber-400">{agentStatus.message}</span>
                )}
              </p>
              {agentStatus.configured && (
                <button
                  onClick={handleExecuteSwap}
                  disabled={executeLoading}
                  className="rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 px-6 py-3 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                >
                  {executeLoading ? "Executing..." : "Execute 0.01 SOL → USDC"}
                </button>
              )}
              {executeResult && (
                <div className={`mt-6 rounded-xl border-2 p-5 ${executeResult.executed ? "border-cyan-500/30 bg-cyan-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                  {executeResult.executed ? (
                    <p className="text-lg text-cyan-400">
                      Tx: {executeResult.signature?.slice(0, 16)}...
                      <a
                        href={`https://explorer.solana.com/tx/${executeResult.signature}${import.meta.env.VITE_SOLANA_RPC?.includes("devnet") ? "?cluster=devnet" : ""}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-cyan-300 underline hover:no-underline"
                      >
                        View
                      </a>
                    </p>
                  ) : (
                    <p className="text-lg text-amber-400">{executeResult.error}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-lg text-slate-500">Loading...</p>
          )}
        </section>

        {/* Propose Swap */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="mb-2 text-lg font-semibold uppercase tracking-wider text-slate-500">
            AI Strategy
          </h2>
          <p className="mb-6 text-lg text-slate-400">
            Propose 1 USDC → SOL. Deepseek evaluates yield opportunity and compliance.
          </p>
          <button
            onClick={handleProposeSwap}
            disabled={proposeLoading}
            className="rounded-xl bg-cyan-500 px-6 py-3 text-lg font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {proposeLoading ? "Running AI..." : "Run Strategy / Propose Swap"}
          </button>
          {proposeResult && (
            <div
              className={`mt-6 rounded-xl border-2 p-6 ${
                proposeResult.proposed
                  ? "border-cyan-500/30 bg-cyan-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
              }`}
            >
              <p
                className={`text-lg font-semibold ${
                  proposeResult.proposed ? "text-cyan-400" : "text-amber-400"
                }`}
              >
                {proposeResult.proposed ? "Proposed" : "Not proposed"}
              </p>
              {proposeResult.rationale && (
                <p className="mt-2 text-base text-slate-400">AI: {proposeResult.rationale}</p>
              )}
              {proposeResult.message && (
                <p className="mt-1 text-base text-slate-500">{proposeResult.message}</p>
              )}
            </div>
          )}
        </section>

        {/* AI-Discovered Opportunities */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-500">
              AI-Discovered Opportunities
            </h2>
            <button
              onClick={handleRunMonitor}
              disabled={monitorLoading}
              className="rounded-xl border-2 border-slate-600 bg-slate-800 px-5 py-2.5 text-lg font-medium text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-700 disabled:opacity-50"
            >
              {monitorLoading ? "Scanning..." : "Scan markets now"}
            </button>
          </div>
          <p className="mb-6 text-lg text-slate-500">
            AI monitors USDC↔SOL every 5 min. Opportunities appear when yield &gt; 0.15%.
          </p>
          {proposalsLoading ? (
            <p className="text-lg text-slate-500">Loading...</p>
          ) : proposals.length === 0 ? (
            <p className="text-lg text-slate-500">No opportunities yet. Run a scan or wait for the next cycle.</p>
          ) : (
            <div className="space-y-4">
              {proposals.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border-2 border-cyan-500/20 bg-cyan-500/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-cyan-400">{p.direction}</span>
                    <span className="text-base text-slate-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-3 text-base text-slate-400">{p.rationale}</p>
                  <p className="mt-2 text-base text-slate-500">
                    {formatAmount(p.direction, p.inAmount, p.outAmount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatAmount(direction: string, inAmt: string, outAmt: string): string {
  const inN = Number(inAmt) || 0;
  const outN = Number(outAmt) || 0;
  const isStableToSol = direction.includes("→SOL");
  if (isStableToSol) {
    const stable = direction.split("→")[0];
    return `${(inN / 1e6).toFixed(2)} ${stable} → ${(outN / 1e9).toFixed(4)} SOL`;
  }
  const stable = direction.split("→")[1];
  return `${(inN / 1e9).toFixed(4)} SOL → ${(outN / 1e6).toFixed(2)} ${stable}`;
}

function ComplianceBadge({
  name,
  status,
  label: statusLabel,
}: {
  name: string;
  status: string;
  label: string;
}) {
  const isVerified = status === "verified" || status === "active" || status === "enabled";
  return (
    <div className="rounded-xl border-2 border-slate-700/50 bg-slate-800/50 p-5">
      <p className="text-base text-slate-500">{name}</p>
      <span
        className={`mt-2 block text-lg font-semibold ${
          isVerified ? "text-cyan-400" : "text-amber-400"
        }`}
      >
        {statusLabel}
      </span>
    </div>
  );
}

function BalanceCard({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border-2 p-6 ${
        highlight ? "border-cyan-500/30 bg-cyan-500/5" : "border-slate-700/50 bg-slate-800/50"
      }`}
    >
      <p className="text-base text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${highlight ? "text-cyan-300" : "text-white"}`}>
        {value}
      </p>
      <p className="mt-1 text-base text-slate-500">{subtext}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Providers>
      <DashboardContent />
    </Providers>
  );
}
