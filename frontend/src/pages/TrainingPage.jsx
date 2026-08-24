import { useEffect, useState } from "react";
import BeginnerMode from "../components/BeginnerMode";
import ChallengePanel from "../components/ChallengePanel";
import CoachPanel from "../components/CoachPanel";
import TypingTest from "../components/TypingTest";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function TrainingPage() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState("");
  const [customText, setCustomText] = useState("");
  const [weaknesses, setWeaknesses] = useState({ weakKeys: [], weakWords: [] });
  const [aiSession, setAiSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [advice, setAdvice] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachMode, setCoachMode] = useState("friendly");

  useEffect(() => {
    const seed = sessionStorage.getItem("typotoxic_practice_seed");
    if (seed) {
      try {
        const parsed = JSON.parse(seed);
        setWeaknesses({ weakKeys: parsed.weakKeys || [], weakWords: parsed.weakWords || [] });
        setAiSession((current) => ({ ...(current || {}), focus: parsed.focus || "weakness practice", weakKeys: parsed.weakKeys || [], weakWords: parsed.weakWords || [], difficulty: Math.max(3, current?.difficulty || 3) }));
        setAdvice(`Loaded ${parsed.focus || "weakness practice"} from Command Center. This run will emphasize your collected mistake buttons and words.`);
      } catch {}
      sessionStorage.removeItem("typotoxic_practice_seed");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    api("/results/stats").then(({ weakKeys, weakWords, aiProfile }) => {
      setWeaknesses({ weakKeys, weakWords });
      setProfile(aiProfile);
    }).catch(() => {});
    api(`/ai/session?mode=${challenge || "everyday"}`).then(({ session }) => setAiSession(session)).catch(() => {});
  }, [user, challenge]);

  const handleResult = async (result) => {
    if (result.profile) setProfile(result.profile);
    if (!user) return;
    setCoachLoading(true);
    try {
      const [{ advice: nextAdvice, profile: nextProfile }, { session }] = await Promise.all([
        api("/ai/coach", { method: "POST", body: JSON.stringify({ result, tone: coachMode }) }),
        api(`/ai/session?mode=${challenge || "everyday"}`),
      ]);
      setAdvice(nextAdvice.message);
      setProfile(nextProfile);
      setAiSession(session);
    } catch {
      setAdvice("I can analyze deeper after login and a saved session. For now, protect accuracy and keep your rhythm even.");
    } finally {
      setCoachLoading(false);
    }
  };

  return <main className="mx-auto w-full max-w-[1680px] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mb-5">
      <p className="font-mono text-[10px] tracking-[.25em] text-cyan-300">TRAINING_GROUND // ADAPTIVE INPUT LAB</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Forge your next run.</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">{aiSession?.recommendation || "Login to unlock adaptive difficulty, weakness prediction, and persistent learning memory."}</p>
    </div>
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-5">
        <TypingTest challenge={challenge} customText={customText} onResult={handleResult} weakKeys={weaknesses.weakKeys} weakWords={weaknesses.weakWords} aiSession={aiSession}/>
        <BeginnerMode onChoose={(lesson) => setCustomText(lesson.text)}/>
      </div>
      <aside className="min-w-0 space-y-5 xl:sticky xl:top-24">
        <CoachPanel advice={advice} profile={profile} loading={coachLoading} coachMode={coachMode} setCoachMode={setCoachMode}/>
        <ChallengePanel selected={challenge} onSelect={setChallenge}/>
      </aside>
    </div>
  </main>;
}
