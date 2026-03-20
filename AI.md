# ATMS – AI Build Guide

**StableHacks 2026 | Cross-Border Stablecoin Treasury Track**

Use this file to stay aligned when building. Reference it for architecture, compliance, and UI decisions.

---

## 1. Hackathon Track

**Primary track:** Cross-Border Stablecoin Treasury

**Pitch:** Corporate treasury that moves money across borders instantly via stablecoins, automates FX, and uses AI to find swap opportunities—all with institutional compliance (KYC, KYT, AML, Travel Rule).

**Key phrases for pitch:**
- "Instant FX via stablecoins"
- "AI-driven cash pooling"
- "Automated treasury rebalancing"
- "Institutional-grade compliance"

---

## 2. Mandatory Prerequisites (All Tracks)

Every solution must address these. Build them visibly.

| Requirement | What It Means | Implementation |
|-------------|---------------|----------------|
| **KYC** | Verify identity of participants | Privy + whitelist; show "KYC Verified" or "Demo mode" |
| **KYT** | Monitor transactions for suspicious activity | Transaction monitoring, risk flags on swaps |
| **AML** | Detect/prevent money laundering | Sanctions checks, reporting hooks |
| **Travel Rule** | Share sender/receiver info for transfers above threshold | Memo field for deposits/withdrawals > $10k |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Corporate Treasury (Vault)                   │
│              USDC + SOL | Squads multi-sig or PDA                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Autonomous AI Agent (Deepseek)                 │
│         Monitors markets → Finds opportunities → Proposes swaps   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Agent Wallet (Solana)                        │
│              Keypair for fees + swap execution                    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Jupiter DEX (Solana)                           │
│              USDC ↔ SOL swaps, real quotes                       │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Compliance Layer                               │
│         KYC | KYT | AML | Travel Rule                            │
└─────────────────────────────────────────────────────────────────┘
```

**Stack:** Vite + React + TypeScript + Tailwind | Express API | Privy | Jupiter | Deepseek | Solana web3.js

---

## 4. Build Priorities (Order Matters)

### Phase 1: Core + Compliance UI ✓ / In Progress
- [x] Vault balances, propose swap, Deepseek evaluation
- [ ] **Compliance section** – KYC, KYT, AML, Travel Rule (visible, even if demo)
- [ ] **Travel Rule** – Memo for deposits/withdrawals above threshold

### Phase 2: Market Monitoring ✓
- [x] Background job – fetch prices every 5 min
- [x] AI evaluates: "Any swap opportunity?" (USDC→SOL, SOL→USDC)
- [x] Proposals API – store and return AI-discovered opportunities
- [x] Dashboard – "AI-discovered opportunities" list + "Scan markets now"

### Phase 3: Agent Wallet ✓
- [x] Agent keypair (env-based, AGENT_KEYPAIR JSON array)
- [x] Fund with SOL for fees (GET /api/agent/status)
- [x] Execute swap via POST /api/execute-swap (signs with agent)

### Phase 4: Execution
- [ ] Real vault (Squads or PDA)
- [ ] Execute approved swaps via Jupiter
- [ ] Or: Squads multi-sig for human approval

---

## 5. UI/UX Standards

**Design principles:**
- Dark theme (slate-950, slate-900) – institutional, fintech
- Accent: indigo/emerald for actions and success
- Clear hierarchy: sections with borders, consistent spacing
- No generic "AI slop" – distinctive typography and layout

**Component patterns:**
- Sections: `rounded-xl border border-slate-800 bg-slate-900/50 p-6`
- Primary button: `bg-indigo-600 hover:bg-indigo-500`
- Success: `text-emerald-400`, Warning: `text-amber-400`
- Cards for balances, proposals, compliance status

**Pages:**
- **Home** – Clear value prop, single CTA
- **Dashboard** – Compliance status, Vault balances, Proposals, Actions
- **Deposit** – Amount input, Travel Rule notice, KYC notice

**Accessibility:**
- Sufficient contrast (slate-400 on slate-950)
- Disabled states visible
- Loading states for async actions

---

## 6. Stablecoins on Solana

| Token | Mint | Decimals |
|-------|------|----------|
| USDC | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v | 6 |
| USDT | Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB | 6 |
| PYUSD | 2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo | 6 |
| SOL | So11111111111111111111111111111111111111112 | 9 |

Monitor checks: USDC↔SOL, USDT↔SOL, PYUSD↔SOL (6 pairs).

---

## 7. API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/vault/balances` | Vault USDC, SOL, total USD |
| `POST /api/monitor/run` | Trigger market scan, return proposals |
| `POST /api/propose-swap` | Jupiter quote + Deepseek → propose or reject |
| `GET /api/proposals` | AI-discovered opportunities (Phase 2) |
| `GET /api/kyc-status` | KYC verified (whitelist) |
| `GET /api/quote` | Jupiter quote only |
| `POST /api/strategy` | Run strategy (quote + AI) |

---

## 8. File Structure

```
src/
  pages/     Home, Login, Dashboard, Deposit
  components/  Providers (Privy)
server/
  index.ts    Express routes
  monitor.ts  Market monitoring (USDC/USDT/PYUSD ↔ SOL)
  deepseek.ts AI recommendations
  jupiter.ts  Fetch + retry for Jupiter
  constants.ts Tokens, API URLs
scripts/
  test-apis.ts   Jupiter + Deepseek connectivity
  test-monitor.ts  Market monitor (npm run test:monitor)
```

---

## 9. Environment

- `VITE_PRIVY_APP_ID` – Privy auth
- `DEEPSEEK_API_KEY` – AI
- `JUPITER_API_KEY` – Jupiter (required)
- `VITE_SOLANA_RPC` – Solana RPC
- `VITE_SQUADS_VAULT` – Vault address (optional)

---

*Last updated: Build alignment for StableHacks 2026*
