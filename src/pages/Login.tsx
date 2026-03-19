import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Providers } from "@/components/Providers";

function LoginContent() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {
      window.location.href = "/dashboard";
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && authenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [ready, authenticated, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-950 p-8">
      <Link to="/" className="text-slate-500 hover:text-white">
        Back
      </Link>
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">Connect Wallet</h1>
        <p className="mb-6 text-slate-400">Sign in to access ATMS</p>
        <button
          onClick={login}
          disabled={!ready}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {ready ? "Connect with Privy" : "Loading..."}
        </button>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Providers>
      <LoginContent />
    </Providers>
  );
}
