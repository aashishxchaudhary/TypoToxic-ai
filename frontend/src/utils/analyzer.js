const ranked = (map, label) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key, count]) => ({ [label]: key, count }));

export const analyzeTyping = ({ text, typed, duration, backspaces, checkpoints = [] }) => {
  const wrongKeys = {};
  const weakWords = {};
  const patterns = new Set();
  let correctChars = 0;
  let wrongChars = 0;
  let punctuationErrors = 0;
  let capitalizationErrors = 0;
  let combo = 0;
  let comboBest = 0;
  [...typed].forEach((char, index) => {
    if (char === text[index]) {
      correctChars += 1;
      combo += 1;
      comboBest = Math.max(comboBest, combo);
    }
    else {
      wrongChars += 1;
      combo = 0;
      if (/[.,!?;:'"()]/.test(text[index] || "")) punctuationErrors += 1;
      if (/[A-Z]/.test(text[index] || "")) capitalizationErrors += 1;
      wrongKeys[text[index] || char] = (wrongKeys[text[index] || char] || 0) + 1;
      patterns.add(`${text[index] || "∅"}→${char || "∅"}`);
    }
  });
  text.split(" ").forEach((word, index) => {
    const typedWord = typed.split(" ")[index] || "";
    if (typedWord && typedWord !== word) weakWords[word] = (weakWords[word] || 0) + 1;
  });
  const minutes = Math.max(duration, 1) / 60;
  const rawWpm = Math.round(typed.length / 5 / minutes);
  const wpm = Math.max(0, Math.round(correctChars / 5 / minutes));
  const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 0;
  const speeds = checkpoints.map((point) => Number(point.wpm)).filter(Number.isFinite);
  const spread = speeds.length ? Math.max(...speeds) - Math.min(...speeds) : 0;
  const consistency = Math.round(Math.max(20, Math.min(100, 100 - spread * 2 - Math.max(0, backspaces - 6))));
  const intervals = checkpoints.flatMap((point) => point.intervals || []).map(Number).filter(Number.isFinite);
  const hesitationIndexes = intervals.map((ms, index) => ms > 650 ? index : -1).filter((index) => index >= 0);
  const hesitationCount = hesitationIndexes.length;
  const rhythmBreaks = intervals.filter((ms, index) => index > 0 && Math.abs(ms - intervals[index - 1]) > 420).length;
  const burstWpm = speeds.length ? Math.max(...speeds) : wpm;
  const fatigueScore = Math.max(0, Math.min(100, Math.round((backspaces * 3) + rhythmBreaks * 2 + Math.max(0, spread - 18))));
  const chartData = checkpoints
    .filter((point) => Number.isFinite(Number(point.time)))
    .map((point) => ({
      time: Number(point.time),
      wpm: Number.isFinite(Number(point.wpm)) ? Number(point.wpm) : 0,
      raw: Number.isFinite(Number(point.rawWpm)) ? Number(point.rawWpm) : 0,
      burst: Number.isFinite(Number(point.burstWpm)) ? Number(point.burstWpm) : 0,
      errors: Number.isFinite(Number(point.errors)) ? Number(point.errors) : 0,
    }));
  return {
    wpm, rawWpm, accuracy, correctChars, wrongChars, backspaceCount: backspaces,
    weakKeys: ranked(wrongKeys, "key"), weakWords: ranked(weakWords, "word"),
    mistakePatterns: [...patterns].slice(0, 8), consistency,
    punctuationErrors,
    capitalizationErrors,
    hesitationCount,
    rhythmBreaks,
    burstWpm,
    fatigueScore,
    comboBest,
    chartData,
    telemetry: { intervals: intervals.slice(-160), mistakeSequence: [...patterns].slice(0, 24), hesitationIndexes: hesitationIndexes.slice(-40) },
  };
};
