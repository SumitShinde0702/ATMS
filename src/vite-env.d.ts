/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRIVY_APP_ID: string;
  readonly VITE_SQUADS_VAULT: string;
  readonly VITE_SOLANA_RPC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
