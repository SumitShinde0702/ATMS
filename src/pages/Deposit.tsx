import { usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Providers } from "@/components/Providers";

const TRAVEL_RULE_THRESHOLD = 10_000;

function DepositContent() {
  const { ready, authenticated, logout } = usePrivy();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [showTravelRule, setShowTravelRule] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const requiresTravelRule = amountNum >= TRAVEL_RULE_THRESHOLD;

  useEffect(() => {
    if (ready && !authenticated) {
      navigate("/login", { replace: true });
    }
  }, [ready, authenticated, navigate]);

  useEffect(() => {
    setShowTravelRule(requiresTravelRule);
  }, [requiresTravelRule]);

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

      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-4xl font-bold text-white">Deposit USDC</h1>
        <p className="mb-8 text-xl text-slate-500">
          Deposit USDC to the treasury. KYC required for production.
        </p>

        <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8">
          <label className="mb-3 block text-lg font-medium text-slate-400">Amount (USDC)</label>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-6 w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-5 py-4 text-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />

          {showTravelRule && (
            <div className="mb-6 rounded-xl border-2 border-amber-500/30 bg-amber-500/10 p-6">
              <p className="text-lg font-semibold text-amber-400">Travel Rule required</p>
              <p className="mt-2 text-base text-slate-400">
                Transfers of $10,000 or more require sender and receiver information per AML
                regulations.
              </p>
              <label className="mt-4 block text-base text-slate-400">
                Travel Rule memo (sender, receiver, purpose)
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="e.g. Sender: Corp Inc. Receiver: ATMS Vault. Purpose: Treasury deposit."
                rows={3}
                className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-slate-800 px-5 py-3 text-base text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {!showTravelRule && amountNum > 0 && (
            <p className="mb-6 text-base text-slate-500">
              Travel Rule: Transfers of $10,000+ require memo with sender/receiver info.
            </p>
          )}

          <button
            disabled
            className="w-full rounded-xl bg-slate-700 py-4 text-lg font-medium text-slate-400 transition"
          >
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
