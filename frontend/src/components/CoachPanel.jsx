import { Bot, BrainCircuit, Radio } from "lucide-react";

export default function CoachPanel({ advice, profile, loading, coachMode, setCoachMode }) {
  const activeMessage = loading
    ? "Analyzing your latest session..."
    : advice || profile?.memory?.lastRecommendation || "Complete a run and I will adapt the next session to your actual typing behavior.";

  return <section className="glass p-5">
    <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[.2em] text-cyan-300">
      <Bot size={15}/> ADAPTIVE COACH
      <span className="ml-auto flex items-center gap-1 text-[9px] text-green-400"><Radio size={11}/> LIVE</span>
    </div>
    <p className="mt-4 text-sm leading-6 text-slate-300">"{activeMessage}"</p>
    <div className="mt-4 grid grid-cols-3 gap-1">
      {["friendly", "savage", "military"].map((mode) => <button key={mode} onClick={() => setCoachMode(mode)} className={`border px-2 py-2 text-[9px] font-bold uppercase tracking-wide ${coachMode === mode ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-300" : "border-white/5 text-slate-600 hover:text-slate-300"}`}>{mode}</button>)}
    </div>
    <div className="mt-5 border-t border-white/5 pt-4">
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[.18em] text-purple-300"><BrainCircuit size={13}/> LEARNING MODEL</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[["DIFF", profile?.difficulty || 3], ["PLATEAU", `${profile?.plateauRisk || 0}%`], ["FATIGUE", `${profile?.fatigueRisk || 0}%`]].map(([label, value]) => <div key={label} className="border border-white/5 bg-white/[.02] p-2"><span className="block text-[9px] text-slate-600">{label}</span><span className="font-mono text-sm text-slate-100">{value}</span></div>)}
      </div>
    </div>
  </section>;
}
