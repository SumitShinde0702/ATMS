import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-8 py-28 md:py-40">
          <p className="mb-6 text-base font-semibold uppercase tracking-[0.2em] text-cyan-400">
            StableHacks 2026 · Cross-Border Stablecoin Treasury
          </p>
          <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            ATMS
          </h1>
          <p className="mb-4 text-2xl font-medium text-slate-300 md:text-3xl">
            Agentic Treasury Management System
          </p>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-slate-500">
            AI monitors markets, finds swap opportunities, and executes—with institutional compliance (KYC, KYT, AML, Travel Rule).
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-3 rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400"
          >
            Connect to access ATMS
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-5xl px-8 py-24 md:py-32">
        <h2 className="mb-16 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          How it works
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          <FeatureCard
            title="AI Market Monitor"
            description="Deepseek evaluates USDC, USDT, PYUSD ↔ SOL every 5 min. Surfaces opportunities when yield > 0.15%."
          />
          <FeatureCard
            title="Compliance Built-in"
            description="KYC, KYT, AML, Travel Rule—visible and ready for institutional use."
          />
          <FeatureCard
            title="Agent Execution"
            description="Autonomous agent wallet signs swaps via Jupiter. Squads multi-sig ready."
          />
        </div>
      </div>

      {/* Stack */}
      <div className="border-t border-slate-800 bg-slate-950/50 px-8 py-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 text-base text-slate-500">
          <span>Solana</span>
          <span className="text-slate-700">·</span>
          <span>Jupiter</span>
          <span className="text-slate-700">·</span>
          <span>Deepseek AI</span>
          <span className="text-slate-700">·</span>
          <span>Privy</span>
          <span className="text-slate-700">·</span>
          <span>USDC · USDT · PYUSD</span>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-slate-800 px-8 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-8 text-xl text-slate-400">
            Instant FX via stablecoins. Automated treasury rebalancing.
          </p>
          <Link
            to="/login"
            className="rounded-xl border-2 border-cyan-500/50 bg-cyan-500/5 px-8 py-4 text-lg font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition hover:border-cyan-500/30">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
      <p className="text-base leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}
