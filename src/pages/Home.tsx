import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-950 p-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">ATMS</h1>
        <p className="text-slate-400">Agentic Treasury Management System</p>
      </div>
      <p className="max-w-sm text-center text-slate-500">
        Institutional-grade stablecoin treasury with AI-driven strategy
      </p>
      <Link
        to="/login"
        className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
      >
        Connect to access ATMS
      </Link>
    </main>
  );
}
