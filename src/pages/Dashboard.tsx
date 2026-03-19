import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Providers } from "@/components/Providers";

interface VaultBalances {
  usdc: number;
  sol: number;
  totalUsd: number;
}

function DashboardContent() {
  const { ready, authenticated, logout } = usePrivy();
  const navigate = useNavigate();
  const [balances, setBalances] = useState<VaultBalances | null>(null);
  const [proposeLoading, setProposeLoading] = useState(false);
  const [proposeResult, setProposeResult] = useState<{
    proposed: boolean;
    rationale?: string;
    message?: string;
  } | null>(null);

  const fetchBalances = useCallback(async () => {
    const res = await fetch("/api/vault/balances");
    const data = await res.json();
    if (res.ok) setBalances(data);
  }, []);

  useEffect(() => {
    if (ready && !authenticated) {
      navigate("/login", { replace: true });
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="text-slate-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-white">
          ATMS
        </Link>
        <nav className="flex gap-4">
          <Link to="/dashboard" className="text-slate-400 hover:text-white">
            Dashboard
          </Link>
          <Link to="/deposit" className="text-slate-400 hover:text-white">
            Deposit
          </Link>
          <button onClick={() => logout()} className="text-slate-400 hover:text-white">
            Logout
          </button>
        </nav>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Compliance Status</h2>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
            KYC: Demo mode
          </span>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Vault Balances</h2>
          {balances ? (
            <div className="space-y-2">
              <p className="text-slate-300">USDC: {balances.usdc.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-slate-300">SOL: {balances.sol.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
              <p className="text-slate-300">Total USD: ${balances.totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <button onClick={fetchBalances} className="mt-2 text-sm text-slate-500 hover:text-slate-400">
                Refresh
              </button>
            </div>
          ) : (
            <p className="text-slate-500">Loading balances...</p>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Propose Swap (Deepseek AI)</h2>
          <p className="mb-4 text-slate-500">Propose 1 USDC -&gt; SOL. Deepseek evaluates.</p>
          <button
            onClick={handleProposeSwap}
            disabled={proposeLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {proposeLoading ? "Running AI..." : "Run Strategy / Propose Swap"}
          </button>
          {proposeResult && (
            <div className="mt-4 rounded-lg bg-slate-800 p-4 text-sm">
              <p className={proposeResult.proposed ? "text-emerald-400" : "text-amber-400"}>
                {proposeResult.proposed ? "Proposed" : "Not proposed"}
              </p>
              {proposeResult.rationale && <p className="mt-1 text-slate-400">AI: {proposeResult.rationale}</p>}
              {proposeResult.message && <p className="mt-1 text-slate-500">{proposeResult.message}</p>}
            </div>
          )}
        </section>
      </div>
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
