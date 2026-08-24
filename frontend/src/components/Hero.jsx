import { ArrowRight, BrainCircuit, ChevronRight, Crosshair, Gauge, Terminal, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return <main className="relative overflow-hidden px-5 pb-20 pt-6 md:pt-10">
    <div className="absolute left-1/2 top-14 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]"/>
    <section className="relative mx-auto max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 font-mono text-[10px] font-bold tracking-[.28em] text-cyan-300"><span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_14px_#4ade80]"/> NEURAL TRAINING SYSTEM ONLINE</div>
        <h1 className="text-glow font-mono text-5xl font-bold leading-none tracking-[-.09em] text-white sm:text-7xl md:text-8xl">TYPO<span className="text-cyan-300">TOXIC</span></h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg font-medium text-slate-400 md:text-xl">We don’t measure typing speed. <span className="text-slate-100">We forge monsters.</span></p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">Adaptive drills. Precision analysis. A training loop that learns exactly where your fingers break formation.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/training" className="group flex items-center justify-center gap-2 bg-cyan-300 px-7 py-4 text-xs font-extrabold uppercase tracking-[.2em] text-slate-950 shadow-[0_0_30px_rgba(38,240,255,.25)] transition hover:bg-white">Start Training <ArrowRight size={16} className="transition group-hover:translate-x-1"/></Link>
          <Link to="/training?mode=test" className="flex items-center justify-center gap-2 border border-purple-400/40 bg-purple-500/10 px-7 py-4 text-xs font-extrabold uppercase tracking-[.2em] text-purple-300 transition hover:bg-purple-500/20"><Gauge size={16}/> Take Typing Test</Link>
        </div>
      </motion.div>
      <div className="mx-auto mt-20 grid max-w-5xl gap-px overflow-hidden border border-cyan-300/10 bg-cyan-300/10 md:grid-cols-3">
        {[["01", "Precision Scanner", "Every missed key, hesitation, and correction becomes a training signal.", Crosshair], ["02", "Adaptive Forge", "Your weakest patterns return as natural, focused practice sets.", BrainCircuit], ["03", "Monster Protocol", "XP, streaks, boss battles, and challenges keep pressure on.", Terminal]].map(([number,title,text,Icon]) => <div className="bg-[#080e19] p-7" key={title}><div className="flex items-center justify-between"><span className="font-mono text-xs text-cyan-300">{number} //</span><Icon size={18} className="text-purple-400"/></div><h3 className="mt-8 font-mono text-sm font-bold tracking-wide text-white">{title}</h3><p className="mt-3 text-xs leading-5 text-slate-500">{text}</p><ChevronRight className="mt-6 text-cyan-300" size={15}/></div>)}
      </div>
    </section>
  </main>;
}
