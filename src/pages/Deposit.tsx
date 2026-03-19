import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Providers } from "@/components/Providers";

function DepositContent() {
  const { ready, authenticated } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !authenticated) {
      navigate("/login", { replace: true });
    }
  }, [ready, authenticated, navigate]);

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
          <Link to="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
          <Link to="/deposit" className="text-slate-400 hover:text-white">Deposit</Link>
        </nav>
      </header>

      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold text-white">Deposit USDC</h1>
        <p className="mb-4 text-slate-500">
          Deposit USDC to the treasury. KYC required for production.
        </p>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <label className="mb-2 block text-sm text-slate-400">Amount (USDC)</label>
          <input
            type="number"
            placeholder="0.00"
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500"
          />
          <p className="mb-4 text-xs text-slate-500">
            Travel Rule: Transfers over $10k require memo.
          </p>
          <button disabled className="w-full rounded-lg bg-slate-700 py-2 text-slate-400">
            Deposit (vault integration pending)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Deposit() {
  return (
    <Providers>
      <DepositContent />
    </Providers>
  );
}
