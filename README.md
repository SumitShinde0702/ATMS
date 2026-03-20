# ATMS – Agentic Treasury Management System

**StableHacks 2026 · Cross-Border Stablecoin Treasury**

AI monitors markets, finds swap opportunities, and executes—with institutional compliance (KYC, KYT, AML, Travel Rule).

## Stack

- **Vite** + React + TypeScript + Tailwind
- **Express** API (Jupiter, Deepseek, agent wallet)
- **Privy** auth (email + wallet)
- **Solana** + Jupiter DEX

## Setup

```bash
npm install
```

Create `.env` (see `.env.example`):

```
VITE_PRIVY_APP_ID=your_privy_app_id
DEEPSEEK_API_KEY=your_deepseek_api_key
JUPITER_API_KEY=your_jupiter_api_key
VITE_SOLANA_RPC=https://api.devnet.solana.com
```

### Agent wallet (for swap execution)

```bash
npm run generate:agent
```

Add the output to `.env` as `AGENT_KEYPAIR="[...]"`, then fund the agent address with SOL:

- **Devnet:** https://faucet.solana.com/
- **Mainnet:** Send SOL to the address

Check balance: `npm run check:agent`

## Run

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001

## Demo flow

1. **Connect** – Login with email (Privy)
2. **Dashboard** – View compliance status, vault balances, AI-discovered opportunities
3. **Propose swap** – Run AI strategy (1 USDC → SOL). Deepseek evaluates.
4. **Execute** – Click "Execute 0.01 SOL → USDC" (agent signs via Jupiter)
5. **Scan markets** – "Scan markets now" to find opportunities

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite + Express |
| `npm run test:apis` | Test Jupiter + Deepseek |
| `npm run test:monitor` | Test market monitor |
| `npm run generate:agent` | Generate agent keypair |
| `npm run check:agent` | Check agent SOL balance |

## API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/vault/balances` | GET | Vault USDC, SOL, total USD |
| `/api/proposals` | GET | AI-discovered opportunities |
| `/api/monitor/run` | POST | Trigger market scan |
| `/api/propose-swap` | POST | Quote + AI evaluation |
| `/api/execute-swap` | POST | Sign and send swap (agent) |
| `/api/agent/status` | GET | Agent wallet status |

## License

MIT
