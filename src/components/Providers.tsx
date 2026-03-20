import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;
  if (!appId || appId === "clmock") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-8">
        <div className="max-w-lg rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">ATMS</h1>
          <p className="mb-6 text-lg text-slate-400">
            Add <code className="rounded bg-slate-800 px-2 py-1">VITE_PRIVY_APP_ID</code> to .env
          </p>
          <p className="text-base text-slate-500">
            Get your app ID from{" "}
            <a href="https://dashboard.privy.io" className="text-cyan-400 hover:underline">
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
          showWalletLoginFirst: false,
        },
        loginMethods: ["email", "wallet"],
        embeddedWallets: {
          ethereum: { createOnLogin: "off" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
