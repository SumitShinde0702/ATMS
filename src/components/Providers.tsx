import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;
  if (!appId || appId === "clmock") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8">
        <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
          <h1 className="mb-2 text-xl font-bold text-white">ATMS</h1>
          <p className="mb-4 text-slate-400">
            Add <code className="rounded bg-slate-800 px-1">VITE_PRIVY_APP_ID</code> to .env
          </p>
          <p className="text-sm text-slate-500">
            Get your app ID from{" "}
            <a href="https://dashboard.privy.io" className="text-indigo-400 hover:underline">
              dashboard.privy.io
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          showWalletLoginFirst: true,
          walletChainType: "solana-only",
          walletList: ["phantom", "solflare", "backpack"],
        },
        loginMethods: ["wallet", "email"],
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({ shouldAutoConnect: false }),
          },
        },
        embeddedWallets: {
          solana: { createOnLogin: "off" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
