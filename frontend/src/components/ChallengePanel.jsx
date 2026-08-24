import { Crosshair, ShieldCheck, TimerReset, Trophy } from "lucide-react";

export const challenges = [
  { id: "no-backspace", title: "No Backspace", desc: "Disable corrections", icon: TimerReset },
  { id: "accuracy-98", title: "98% Accuracy", desc: "Precision over speed", icon: ShieldCheck },
  { id: "speed-burst", title: "Speed Burst", desc: "15 second overdrive", icon: Crosshair },
  { id: "boss-battle", title: "Boss Battle", desc: "60 seconds. No mercy.", icon: Trophy },
];
export default function ChallengePanel({ selected, onSelect }) {
  return <section className="glass p-5">
    <div className="mb-3 font-mono text-[11px] font-bold tracking-[.2em] text-slate-500">CHALLENGE_PROTOCOLS</div>
    <div className="grid gap-2">
      {challenges.map(({ id, title, desc, icon: Icon }) => <button onClick={() => onSelect(selected === id ? "" : id)} key={id} className={`flex items-center gap-3 border p-3 text-left transition ${selected === id ? "border-purple-400/60 bg-purple-500/10" : "border-white/5 bg-white/[.02] hover:border-cyan-400/20"}`}><Icon size={16} className={selected === id ? "text-purple-300" : "text-slate-600"}/><span><span className="block text-xs font-bold text-slate-200">{title}</span><span className="mt-1 block text-[10px] text-slate-600">{desc}</span></span></button>)}
    </div>
  </section>;
}
