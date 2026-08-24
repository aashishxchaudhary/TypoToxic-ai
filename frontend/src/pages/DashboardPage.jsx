import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { api } from "../utils/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api("/results/stats").then(setStats).catch((err) => setError(err.message)); }, []);
  return <main className="mx-auto max-w-7xl px-5 py-10"><div className="mb-7"><p className="font-mono text-[10px] tracking-[.25em] text-cyan-300">COMMAND_CENTER // PERFORMANCE INTELLIGENCE</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Your forge report.</h1></div>{error ? <p className="text-red-400">{error}</p> : stats ? <Dashboard stats={stats}/> : <p className="font-mono text-xs text-cyan-300">SCANNING RESULTS...</p>}</main>;
}
