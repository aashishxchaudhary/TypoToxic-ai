import { BookOpen, ChevronRight } from "lucide-react";
import { beginnerLessons } from "../data/wordBanks";

export default function BeginnerMode({ onChoose }) {
  return <section className="glass p-5">
    <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[.2em] text-green-400"><BookOpen size={15}/> BEGINNER_PATH</div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {beginnerLessons.map((lesson, index) => <button key={lesson.title} onClick={() => onChoose(lesson)} className="group flex items-center gap-3 border border-white/5 bg-white/[.02] p-3 text-left transition hover:border-green-400/30 hover:bg-green-400/5"><span className="font-mono text-xs text-green-400">0{index + 1}</span><span><span className="block text-xs font-bold text-slate-200">{lesson.title}</span><span className="mt-1 block text-[10px] text-slate-600">{lesson.subtitle}</span></span><ChevronRight className="ml-auto text-slate-700 transition group-hover:text-green-300" size={15}/></button>)}
    </div>
  </section>;
}
