# ATMS - Agentic Treasury Management System

Institutional-grade stablecoin treasury with AI-driven strategy (StableHacks 2026).

## Stack

- **Vite** + React + TypeScript + Tailwind
- **Express** API server (Jupiter, Deepseek, vault)
- **Privy** auth (Phantom, Solflare)
- **React Router** for routing

## Setup

```bash
npm install
```

Create `.env`:
```
VITE_PRIVY_APP_ID=your_privy_app_id
DEEPSEEK_API_KEY=your_deepseek_api_key
JUPITER_API_KEY=your_jupiter_api_key
VITE_SOLANA_RPC=https://api.devnet.solana.com
```

## Run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

Vite proxies `/api` to the Express server.
