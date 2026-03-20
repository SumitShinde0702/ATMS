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
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-[#0a0a0f] p-8">
      <Link to="/" className="text-lg text-slate-500 transition hover:text-white">
        ← Back
      </Link>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Connect</h1>
        <p className="mb-10 text-xl text-slate-400">Sign in to access ATMS</p>
        <button
          onClick={login}
          disabled={!ready}
          className="rounded-xl bg-cyan-500 px-10 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
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
