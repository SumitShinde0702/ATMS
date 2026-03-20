import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-8 py-28 md:py-40">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-1.5 text-sm font-semibold text-cyan-400">
              StableHacks 2026
            </span>
            <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
              Cross-Border Stablecoin Treasury
            </span>
          </div>
          <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            ATMS
          </h1>
          <p className="mb-4 text-2xl font-medium text-slate-300 md:text-3xl">
            Agentic Treasury Management System
          </p>
          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Corporate treasury that moves money across borders instantly via stablecoins, automates FX, and uses AI to find swap opportunities—all with institutional compliance (KYC, KYT, AML, Travel Rule).
          </p>
          <div className="mb-14 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400"
            >
              Connect to access ATMS
              <span className="text-xl">→</span>
            </Link>
            <a
              href="https://dorahacks.io/hackathon/stablehacks/detail"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/50 px-6 py-4 text-lg font-semibold text-slate-300 transition hover:border-cyan-500/30"
            >
              Hackathon details
            </a>
          </div>
        </div>
      </div>

      {/* Pitch: Problem, Vision, Solution, Key Differentiators */}
      <section className="mx-auto max-w-5xl px-8 py-20 md:py-28">
        <h2 className="mb-16 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          Problem · Vision · Solution
        </h2>

        <div className="space-y-12">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8">
            <h3 className="mb-4 text-xl font-bold text-amber-400">Problem</h3>
            <p className="mb-4 text-base leading-relaxed text-slate-400">
              Corporate treasuries face slow cross-border transfers, manual FX management, and fragmented compliance. Moving money internationally takes days, rebalancing is reactive, and KYC/KYT/AML/Travel Rule integration is often an afterthought.
            </p>
            <p className="text-base leading-relaxed text-slate-500">
              Stablecoins can enable instant settlements—but institutions need a compliant, automated layer to manage them safely.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-8">
            <h3 className="mb-4 text-xl font-bold text-indigo-400">Vision</h3>
            <p className="text-base leading-relaxed text-slate-400">
              A world where corporate treasuries move value across borders instantly via stablecoins, with AI automating FX and swap decisions—while staying fully compliant with institutional regulations. ATMS bridges DeFi efficiency with TradFi rigor.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-8">
            <h3 className="mb-4 text-xl font-bold text-cyan-400">Solution</h3>
            <p className="mb-4 text-base leading-relaxed text-slate-400">
              ATMS is an <strong className="text-white">AI-driven corporate treasury</strong> that uses stablecoins (USDC, USDT, PYUSD) on Solana for instant cross-border movement, automates FX via Jupiter DEX, and deploys an autonomous AI agent to monitor markets and propose swaps when opportunities exceed a yield threshold.
            </p>
            <p className="text-base leading-relaxed text-slate-500">
              Compliance is built-in from day one: KYC, KYT, AML, and Travel Rule are visible in the UI and implemented in the flow.
            </p>
          </div>
        </div>
      </section>

      {/* Key differentiators */}
      <section className="border-t border-slate-800 bg-slate-950/50 px-8 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
            Key differentiators
          </h2>
          <ul className="mx-auto max-w-2xl space-y-4 text-lg text-slate-400">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-cyan-400">✓</span>
              <span><strong className="text-white">AI-first</strong> — Autonomous market monitoring and swap recommendations, not just a UI on top of manual actions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-cyan-400">✓</span>
              <span><strong className="text-white">Compliance by design</strong> — KYC, KYT, AML, Travel Rule visible and wired into deposit/withdraw/swap flows from day one</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-cyan-400">✓</span>
              <span><strong className="text-white">Squads integration</strong> — Multi-sig approval path for human oversight, or autonomous agent execution—configurable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-cyan-400">✓</span>
              <span><strong className="text-white">Multi-stablecoin</strong> — USDC, USDT, PYUSD ↔ SOL across 6 pairs for diversified treasury management</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-5xl px-8 py-20 md:py-28">
        <h2 className="mb-16 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          Team
        </h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          <TeamCard
            name="Sumit Sanjay Shinde"
            linkedin="https://www.linkedin.com/in/sumit-sanjay-shinde-68a34b20b/"
            imageSrc="/team/sumit.jpg"
            bullets={["SWE intern @ Gemini", "SWE @ Space Armour", "Co-Founder @ PaySync"]}
          />
          <TeamCard
            name="Ariel Ong"
            linkedin="https://www.linkedin.com/in/ariel-ong-5714b9156/"
            imageSrc="/team/ariel.jpg"
            bullets={["Research Consultant @ WorldQuant", "Full Stack Dev @ NUS FinTech Lab", "XRPL Builder @ Ripple"]}
          />
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="border-t border-slate-800 bg-slate-950/50 px-8 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
            Architecture
          </h2>
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-700 bg-[#0a0a0f] p-8 md:p-12">
            <div className="mx-auto flex min-w-[320px] flex-col items-center gap-0">
              <DiagramBox title="Corporate Treasury (Vault)" sub="USDC + SOL | Squads multi-sig or PDA" first />
              <DiagramArrow />
              <DiagramBox title="Autonomous AI Agent (Deepseek)" sub="Monitors markets → Finds opportunities → Proposes swaps" />
              <DiagramArrow />
              <DiagramBox title="Agent Wallet (Solana)" sub="Keypair for fees + swap execution" />
              <DiagramArrow />
              <DiagramBox title="Jupiter DEX (Solana)" sub="USDC ↔ SOL swaps, real quotes" />
              <DiagramArrow />
              <DiagramBox title="Compliance Layer" sub="KYC | KYT | AML | Travel Rule" last />
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Flow */}
      <section className="mx-auto max-w-5xl px-8 py-20 md:py-28">
        <h2 className="mb-16 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          How it works
        </h2>
        <div className="space-y-8">
          <FlowStep num={1} title="Market monitoring" desc="Background job fetches Jupiter quotes for USDC, USDT, PYUSD ↔ SOL every 5 minutes. AI (Deepseek) evaluates whether yield exceeds 0.15% threshold." />
          <FlowStep num={2} title="AI opportunity discovery" desc="When conditions are met, the AI surfaces a swap proposal with rationale. Proposals are stored and displayed in the dashboard." />
          <FlowStep num={3} title="Strategy & compliance check" desc="On propose/execute, the AI re-evaluates the swap in context of current vault state. Compliance layer checks KYC, KYT, AML; Travel Rule applies for deposits/withdrawals above threshold." />
          <FlowStep num={4} title="Execution paths" desc="Approved swaps can execute via autonomous agent wallet (signed by server keypair) or pass through Squads multi-sig for human approval—configurable per deployment." />
        </div>
      </section>

      {/* Flow Diagram (visual) */}
      <section className="border-t border-slate-800 bg-slate-950/50 px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
            End-to-end flow
          </h2>
          <div className="rounded-2xl border-2 border-slate-700 bg-[#0a0a0f] p-6 md:p-10">
            <svg viewBox="0 0 600 240" className="w-full" fill="none">
              <defs>
                <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M 0 0 L 8 4 L 0 8 Z" fill="rgba(34,211,238,0.6)" />
                </marker>
              </defs>
              {/* Row 1: Data flow */}
              <rect x="50" y="20" width="100" height="50" rx="8" fill="#1e293b" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
              <text x="100" y="48" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Market prices</text>
              <text x="100" y="60" textAnchor="middle" fill="#64748b" fontSize="9">Jupiter API</text>

              <rect x="250" y="20" width="100" height="50" rx="8" fill="#1e293b" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
              <text x="300" y="48" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">AI Monitor</text>
              <text x="300" y="60" textAnchor="middle" fill="#64748b" fontSize="9">Deepseek eval</text>

              <rect x="450" y="20" width="100" height="50" rx="8" fill="#1e293b" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
              <text x="500" y="48" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="600">Proposals</text>
              <text x="500" y="60" textAnchor="middle" fill="#64748b" fontSize="9">Opportunities</text>

              <path d="M 150 45 L 250 45" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />
              <path d="M 350 45 L 450 45" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />

              {/* Row 2: Compliance */}
              <rect x="150" y="110" width="120" height="50" rx="8" fill="#1e293b" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" />
              <text x="210" y="137" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">KYC / KYT / AML</text>

              <rect x="330" y="110" width="140" height="50" rx="8" fill="#1e293b" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" />
              <text x="400" y="137" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600">Travel Rule memo</text>

              {/* Row 3: Execution */}
              <rect x="220" y="190" width="160" height="40" rx="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
              <text x="300" y="214" textAnchor="middle" fill="#67e8f9" fontSize="12" fontWeight="600">Jupiter swap execution</text>

              {/* Connectors */}
              <path d="M 300 70 L 300 110" stroke="rgba(34,211,238,0.4)" strokeWidth="1" strokeDasharray="4" />
              <path d="M 210 160 L 300 190" stroke="rgba(34,211,238,0.4)" strokeWidth="1" strokeDasharray="4" />
              <path d="M 400 160 L 300 190" stroke="rgba(34,211,238,0.4)" strokeWidth="1" strokeDasharray="4" />
            </svg>
            <p className="mt-6 text-center text-sm text-slate-500">
              Market data → AI evaluates → Proposals surfaced → Compliance checks → Swap execution via Jupiter
            </p>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="mx-auto max-w-5xl px-8 py-20 md:py-28">
        <h2 className="mb-12 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          Institutional compliance (mandatory)
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ComplianceCard
            name="KYC"
            desc="Verify identity of participants. Privy + whitelist; UI shows 'KYC Verified' or Demo mode."
          />
          <ComplianceCard
            name="KYT"
            desc="Monitor transactions for suspicious activity. Risk flags on swaps and deposits."
          />
          <ComplianceCard
            name="AML"
            desc="Detect and prevent money laundering. Sanctions checks and reporting hooks."
          />
          <ComplianceCard
            name="Travel Rule"
            desc="Share sender/receiver info for transfers above threshold. Memo field for deposits/withdrawals > $10k."
          />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-950/50 px-8 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
            Key features
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
              description="Autonomous agent wallet signs swaps via Jupiter. Squads multi-sig ready for human approval."
            />
          </div>
        </div>
      </section>

      {/* Stack & Hackathon info */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <h2 className="mb-8 text-center text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          Tech stack
        </h2>
        <div className="mb-16 flex flex-wrap items-center justify-center gap-6 text-base text-slate-500">
          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">Solana</span>
          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">Jupiter</span>
          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">Deepseek AI</span>
          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">Privy</span>
          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">Squads</span>
          <span className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">USDC · USDT · PYUSD</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-400">StableHacks 2026</h3>
          <p className="mb-4 text-base text-slate-500">
            Building Institutional Stablecoin Infrastructure on Solana · $220k prize pool · Track: Cross-Border Stablecoin Treasury
          </p>
          <p className="text-sm text-slate-600">
            Organised by Tenity · Co-hosts: Solana Foundation, AMINA Bank, Solstice
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="border-t border-slate-800 px-8 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xl text-slate-400">
            Instant FX via stablecoins. AI-driven cash pooling. Automated treasury rebalancing.
          </p>
          <p className="mb-8 text-base text-slate-500">
            Connect with Privy to access the dashboard, view vault balances, and run AI-powered swap proposals.
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

function DiagramBox({
  title,
  sub,
  first,
  last,
}: {
  title: string;
  sub: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`w-full max-w-md rounded-xl border-2 border-cyan-500/30 bg-slate-900/80 px-6 py-5 ${first ? "rounded-t-2xl" : ""} ${last ? "rounded-b-2xl" : ""}`}
    >
      <p className="text-base font-semibold text-cyan-400">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function DiagramArrow() {
  return (
    <div className="flex h-10 w-full justify-center py-1">
      <svg className="h-8 w-8 text-cyan-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}

function FlowStep({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-cyan-500/50 bg-cyan-500/10 text-lg font-bold text-cyan-400">
        {num}
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
        <p className="text-base leading-relaxed text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function ComplianceCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-emerald-500/20">
      <h3 className="mb-3 text-lg font-bold text-emerald-400">{name}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
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

function TeamCard({
  name,
  linkedin,
  imageSrc,
  bullets,
}: {
  name: string;
  linkedin: string;
  imageSrc: string;
  bullets?: string[];
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <a
      href={linkedin}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col items-center rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8 transition hover:border-cyan-500/30"
    >
      <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-slate-700 bg-slate-800">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            const fallback = (e.target as HTMLImageElement).nextElementSibling;
            if (fallback) (fallback as HTMLElement).style.display = "flex";
          }}
        />
        <div
          className="absolute inset-0 hidden items-center justify-center text-2xl font-bold text-cyan-400"
          style={{ display: "none" }}
          aria-hidden
        >
          {initials}
        </div>
      </div>
      <p className="text-lg font-semibold text-white">{name}</p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-center">
          {bullets.map((b) => (
            <li key={b} className="text-sm text-slate-500">
              {b}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 transition group-hover:text-cyan-400">
        <LinkedInIcon />
        LinkedIn
      </p>
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
