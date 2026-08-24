import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, RotateCcw, Target, Timer, Zap } from "lucide-react";
import { api } from "../utils/api";
import { analyzeTyping } from "../utils/analyzer";
import { generateParagraphs } from "../utils/textGenerator";
import { useAuth } from "../context/AuthContext";
import { finalModes } from "../data/wordBanks";
import ResultGraph from "./ResultGraph";

const durations = [15, 30, 60];
const windowSize = 1;
const challengeDurations = {
  "no-backspace": 30,
  "accuracy-98": 60,
  "speed-burst": 15,
  "boss-battle": 60,
};

export default function TypingTest({ challenge = "", customText = "", onResult, weakKeys = [], weakWords = [], aiSession = null }) {
  const { user, setUser } = useAuth();
  const inputRef = useRef(null);
  const keyTimerRef = useRef({ last: 0, intervals: [] });
  const [mode, setMode] = useState("everyday");
  const [duration, setDuration] = useState(30);
  const [paragraphs, setParagraphs] = useState(() => generateParagraphs({ mode: "everyday", count: 6 }));
  const [windowStart, setWindowStart] = useState(0);
  const [typed, setTyped] = useState("");
  const [completedTarget, setCompletedTarget] = useState("");
  const [completedTyped, setCompletedTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [backspaces, setBackspaces] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [windowPulse, setWindowPulse] = useState(false);

  const effectiveDuration = challengeDurations[challenge] || duration;
  const visibleText = useMemo(() => {
    if (customText) return customText;
    return paragraphs.slice(windowStart, windowStart + windowSize).join("\n\n");
  }, [customText, paragraphs, windowStart]);
  const fullTarget = completedTarget + visibleText;
  const fullTyped = completedTyped + typed;
  const displayWords = useMemo(() => {
    let cursor = 0;
    return visibleText.split(" ").map((word, wordIndex) => {
      const start = cursor;
      cursor += word.length + (wordIndex < visibleText.split(" ").length - 1 ? 1 : 0);
      return { word, start };
    });
  }, [visibleText]);

  const refillQueue = useCallback((nextMode = mode) => {
    setParagraphs(generateParagraphs({ mode: nextMode, weakKeys, weakWords, aiSession, count: 6 }));
    setWindowStart(0);
  }, [aiSession, mode, weakKeys, weakWords]);

  const reset = useCallback((nextMode = mode) => {
    if (!customText) {
      setParagraphs(generateParagraphs({ mode: nextMode, weakKeys, weakWords, aiSession, count: 6 }));
      setWindowStart(0);
    }
    setTyped("");
    setCompletedTarget("");
    setCompletedTyped("");
    setTimeLeft(challengeDurations[challenge] || duration);
    setStarted(false);
    setFinished(false);
    setBackspaces(0);
    setAnalysis(null);
    setCheckpoints([]);
    keyTimerRef.current = { last: 0, intervals: [] };
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [aiSession, challenge, customText, duration, mode, weakKeys, weakWords]);

  useEffect(() => {
    if (finished || analysis) return;
    reset(mode);
  }, [customText, challenge, aiSession?.difficulty, aiSession?.focus]);
  useEffect(() => { setTimeLeft(effectiveDuration); }, [effectiveDuration]);

  const finish = useCallback(async (finalTyped = fullTyped, finalTarget = fullTarget) => {
    if (finished) return;
    setFinished(true);
    setStarted(false);
    inputRef.current?.blur();
    const result = analyzeTyping({
      text: finalTarget,
      typed: finalTyped,
      duration: effectiveDuration - timeLeft || 1,
      backspaces,
      checkpoints: [...checkpoints, { intervals: keyTimerRef.current.intervals }],
    });
    setAnalysis(result);
    onResult?.(result);
    if (user) {
      try {
        const data = await api("/results", { method: "POST", body: JSON.stringify({ ...result, mode, duration: effectiveDuration }) });
        setUser(data.user);
        onResult?.({ ...result, profile: data.profile });
        if (challenge) await api("/challenges", { method: "POST", body: JSON.stringify({ challengeType: challenge, completed: challenge === "no-backspace" ? result.backspaceCount === 0 : challenge === "accuracy-98" ? result.accuracy >= 98 : true, score: result.wpm }) });
      } catch (error) {
        console.error(error);
      }
    }
  }, [backspaces, challenge, checkpoints, effectiveDuration, finished, fullTarget, fullTyped, mode, onResult, setUser, timeLeft, user]);

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => setTimeLeft((value) => value <= 1 ? (clearInterval(id), 0) : value - 1), 1000);
    return () => clearInterval(id);
  }, [finished, started]);

  useEffect(() => { if (started && timeLeft === 0) finish(); }, [finish, started, timeLeft]);

  useEffect(() => {
    if (!started || finished) return;
    const elapsed = effectiveDuration - timeLeft;
    if (elapsed <= 0) return;
    setCheckpoints((items) => {
      if (items.at(-1)?.time === elapsed) return items;
      const live = analyzeTyping({ text: fullTarget, typed: fullTyped, duration: elapsed, backspaces, checkpoints: items });
      return [...items, { time: elapsed, wpm: live.wpm, rawWpm: live.rawWpm, burstWpm: Math.max(live.wpm, live.rawWpm), errors: live.wrongChars }];
    });
  }, [backspaces, effectiveDuration, finished, fullTarget, fullTyped, started, timeLeft]);

  const live = useMemo(() => analyzeTyping({ text: fullTarget, typed: fullTyped, duration: Math.max(1, effectiveDuration - timeLeft), backspaces, checkpoints }), [backspaces, checkpoints, effectiveDuration, fullTarget, fullTyped, timeLeft]);

  const advanceWindow = (nextTyped) => {
    const targetWithSpace = completedTarget + visibleText + " ";
    const typedWithSpace = completedTyped + nextTyped + " ";
    setCompletedTarget(targetWithSpace);
    setCompletedTyped(typedWithSpace);
    setTyped("");
    keyTimerRef.current.last = 0;
    setWindowPulse(true);
    setTimeout(() => setWindowPulse(false), 260);
    if (customText) {
      setTimeout(() => finish(typedWithSpace.trimEnd(), targetWithSpace.trimEnd()), 0);
      return;
    }
    const nextStart = windowStart + windowSize;
    if (nextStart + windowSize >= paragraphs.length) {
      setParagraphs((items) => [...items, ...generateParagraphs({ mode, weakKeys, weakWords, aiSession, count: 4 })]);
    }
    setWindowStart(nextStart);
  };

  const onKeyDown = (event) => {
    if (finished || analysis) {
      event.preventDefault();
      return;
    }
    if (event.key.length === 1) {
      const now = performance.now();
      if (keyTimerRef.current.last) keyTimerRef.current.intervals.push(Math.round(now - keyTimerRef.current.last));
      keyTimerRef.current.last = now;
    }
    if (event.key === "Backspace") {
      setBackspaces((value) => value + 1);
      if (challenge === "no-backspace") event.preventDefault();
    }
    if (!started && event.key.length === 1) setStarted(true);
  };

  const onChange = (event) => {
    if (finished || analysis) return;
    const nextTyped = event.target.value;
    setTyped(nextTyped);
    if (nextTyped.length >= visibleText.length) advanceWindow(nextTyped);
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setCompletedTarget("");
    setCompletedTyped("");
    setTyped("");
    refillQueue(nextMode);
    reset(nextMode);
  };

  const startMistakeDrill = () => {
    const mistakeKeys = analysis?.weakKeys || [];
    const mistakeWords = analysis?.weakWords || [];
    setMode("everyday");
    setParagraphs(generateParagraphs({ mode: "everyday", weakKeys: mistakeKeys, weakWords: mistakeWords, aiSession: { ...(aiSession || {}), difficulty: Math.max(2, aiSession?.difficulty || 3) }, count: 6 }));
    setWindowStart(0);
    setTyped("");
    setCompletedTarget("");
    setCompletedTyped("");
    setTimeLeft(effectiveDuration);
    setStarted(false);
    setFinished(false);
    setBackspaces(0);
    setAnalysis(null);
    setCheckpoints([]);
    keyTimerRef.current = { last: 0, intervals: [] };
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  return <section className="glass overflow-hidden shadow-neon">
    <div className="flex flex-wrap items-center gap-2 border-b border-cyan-300/10 px-5 py-4">
      <span className="mr-2 flex items-center gap-2 font-mono text-[10px] font-bold tracking-[.2em] text-cyan-300"><Zap size={14} className={started ? "typing-zap" : ""}/> FORGE_TERMINAL</span>
      {finalModes.map((item) => <button key={item.id} title={item.description} onClick={() => changeMode(item.id)} className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ${mode === item.id ? "bg-cyan-300/10 text-cyan-300" : "text-slate-600 hover:text-slate-300"}`}>{item.label}</button>)}
      <div className="ml-auto flex items-center gap-1">
        {challenge && <span className="mr-2 font-mono text-[9px] uppercase tracking-widest text-purple-300">challenge timer</span>}
        {durations.map((seconds) => <button key={seconds} onClick={() => { setDuration(seconds); setTimeLeft(challengeDurations[challenge] || seconds); }} className={`px-2 py-1 font-mono text-[10px] ${(challengeDurations[challenge] || duration) === seconds ? "text-yellow-400" : "text-slate-600"}`}>{seconds}s</button>)}
      </div>
    </div>
    <div className="grid grid-cols-3 gap-px bg-cyan-300/10 text-center md:grid-cols-6">
      {[["TIME", timeLeft, Timer], ["WPM", live.wpm, Zap], ["ACC", `${live.accuracy}%`, Target], ["RAW", live.rawWpm, null], ["ERRORS", live.wrongChars, null], ["COMBO", live.comboBest, null]].map(([label,value,Icon]) => <div key={label} className="bg-[#08101c] px-3 py-4"><span className="block font-mono text-[9px] tracking-[.18em] text-slate-600">{label}</span><span className={`mt-1 flex items-center justify-center gap-1 font-mono text-xl font-bold text-slate-100 ${label === "COMBO" && live.comboBest > 20 ? "combo-pulse text-yellow-300" : ""}`}>{Icon && <Icon size={14} className="text-cyan-300"/>}{value}</span></div>)}
    </div>
    {!analysis && <div className={`typing-stage monkeytype-stage relative min-h-[300px] px-4 py-9 md:px-6 md:py-12 ${started ? "is-active" : ""}`} onClick={() => inputRef.current?.focus()}>
      <div className="mb-5 text-center font-mono text-xs tracking-widest text-slate-600">english</div>
      <div className={`typing-window three-line-window mx-auto w-full max-w-[1180px] text-center font-mono text-[26px] leading-[1.6] tracking-normal md:text-[32px] 2xl:text-[36px] ${windowPulse ? "window-shift" : ""}`}>
        {displayWords.map(({ word, start }, wordIndex) => <span key={`${windowStart}-${wordIndex}-${start}`} className="word-cell">
          {[...word].map((char, offset) => {
            const index = start + offset;
            const state = index >= typed.length ? "pending-char" : typed[index] === char ? "correct-char" : "wrong-char";
            return <span key={`${windowStart}-${index}`} className={`char-cell ${index === typed.length ? "typing-caret current-char" : ""} ${state}`}>{char}</span>;
          })}
          {start + word.length < visibleText.length && <span className={`char-cell word-space ${start + word.length === typed.length ? "typing-caret current-char" : ""}`}>&nbsp;</span>}
        </span>)}
      </div>
      <input ref={inputRef} autoFocus value={typed} onChange={onChange} onKeyDown={onKeyDown} className="absolute inset-0 h-full w-full cursor-text opacity-0" aria-label="Typing input"/>
      <div className="pointer-events-none absolute bottom-4 right-5 font-mono text-[10px] text-slate-700">paragraph {Math.floor(windowStart / windowSize) + 1} // next paragraph loads automatically</div>
    </div>}
    {!analysis && <div className="flex items-center justify-between border-t border-white/5 px-5 py-4">
      <span className="font-mono text-[10px] text-slate-600">{aiSession?.focus ? `FOCUS: ${aiSession.focus}` : challenge ? `PROTOCOL: ${challenge.toUpperCase()}` : started ? "INPUT STREAM ACTIVE" : "CLICK TERMINAL AND START TYPING"}</span>
      <button onClick={() => reset()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-300"><RotateCcw size={14}/> Restart</button>
    </div>}
    {analysis && <ResultGraph analysis={analysis} duration={effectiveDuration} mode={mode} onRestart={() => reset()}/>}
    {analysis && <div className="border-t border-green-400/20 bg-green-400/[.04] p-5">
      <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-green-400"><CheckCircle2 size={15}/> RUN ANALYZED</div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Hesitations", analysis.hesitationCount], ["Rhythm breaks", analysis.rhythmBreaks], ["Fatigue", `${analysis.fatigueScore}%`], ["Weak keys", analysis.weakKeys.map((item) => item.key).join(" ") || "none"]].map(([label,value]) => <div key={label}><span className="text-[10px] uppercase tracking-wider text-slate-600">{label}</span><span className="mt-1 block font-mono text-lg font-bold text-slate-100">{value}</span></div>)}</div>
      <button onClick={startMistakeDrill} className="mt-5 bg-cyan-300 px-4 py-2 font-mono text-[10px] font-extrabold uppercase tracking-widest text-slate-950 hover:bg-white">Generate weak-key test</button>
    </div>}
  </section>;
}
