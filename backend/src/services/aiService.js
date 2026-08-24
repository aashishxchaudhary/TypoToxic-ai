import LearningProfile from "../models/LearningProfile.js";
import { usingMemoryDb } from "../config/db.js";
import { memoryStore } from "../config/memoryStore.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const avg = (items, field) => items.length ? items.reduce((sum, item) => sum + (item[field] || 0), 0) / items.length : 0;
const last = (items, count) => items.slice(Math.max(0, items.length - count));

const topEntries = (items, field, key) => {
  const counts = {};
  items.flatMap((item) => item[field] || []).forEach((entry) => {
    const name = typeof entry === "string" ? entry : entry[key];
    if (!name) return;
    counts[name] = (counts[name] || 0) + (entry.count || 1);
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ [key]: name, count }));
};
const top = (items, field, key) => topEntries(items, field, key).map((item) => item[key]);

const getProfile = async (userId) => {
  if (usingMemoryDb) {
    let profile = memoryStore.learningProfiles.find((item) => item.userId === userId);
    if (!profile) {
      profile = {
        userId,
        skillScore: 35,
        difficulty: 3,
        plateauRisk: 0,
        fatigueRisk: 0,
        improvementVelocity: 0,
        projectedWpm7Days: 0,
        projectedAccuracy7Days: 0,
        strongestSkills: [],
        weakPatterns: [],
        predictedWeakAreas: [],
        weakKeyBank: [],
        weakWordBank: [],
        adaptiveMissions: [],
        achievements: [],
        memory: { preferredMode: "everyday", antiRepeatSeeds: [], sessionCount: 0 },
        createdAt: new Date(),
      };
      memoryStore.learningProfiles.push(profile);
    }
    return profile;
  }
  return LearningProfile.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { new: true, upsert: true },
  );
};

const saveProfile = async (profile) => {
  profile.updatedAt = new Date();
  if (!usingMemoryDb) await profile.save();
  return profile;
};

const slope = (items, field) => {
  if (items.length < 2) return 0;
  return Math.round((items.at(-1)[field] || 0) - (items[0][field] || 0));
};

const detectRhythm = (results) => {
  const recent = last(results, 6);
  const avgConsistency = avg(recent, "consistency");
  const backspace = avg(recent, "backspaceCount");
  const hesitation = avg(recent, "hesitationCount");
  if (avgConsistency < 70) return "rhythm breaks under pressure";
  if (hesitation > 8) return "hesitation before complex transitions";
  if (backspace > 12) return "correction dependency";
  return "steady rhythm control";
};

const predictWeakAreas = (results) => {
  const recent = last(results, 8);
  const weakKeys = top(recent, "weakKeys", "key");
  const patterns = top(recent.map((item) => ({ mistakePatterns: item.mistakePatterns || [] })), "mistakePatterns", "pattern");
  const predictions = [];
  if (avg(recent, "punctuationErrors") > 1.5) predictions.push("punctuation hesitation");
  if (avg(recent, "capitalizationErrors") > 1.5) predictions.push("capitalization control");
  if (weakKeys.length) predictions.push(`key cluster: ${weakKeys.slice(0, 3).join(", ")}`);
  if (patterns.length) predictions.push(`repeated typo pattern: ${patterns[0]}`);
  if (slope(recent, "wpm") < 2 && avg(recent, "accuracy") < 94) predictions.push("speed plateau from accuracy leakage");
  return predictions.slice(0, 5);
};

const buildMissions = (profile, results) => {
  const predictions = profile.predictedWeakAreas || [];
  const accuracy = avg(last(results, 5), "accuracy");
  const missions = [
    { title: "Precision Lock", target: "Finish one session above 96% accuracy", progress: clamp(accuracy, 0, 100), completed: accuracy >= 96 },
    { title: "Rhythm Repair", target: "Keep consistency above 82 for three runs", progress: clamp(avg(last(results, 3), "consistency"), 0, 100), completed: avg(last(results, 3), "consistency") >= 82 },
  ];
  if (predictions.some((item) => item.includes("punctuation"))) {
    missions.push({ title: "Punctuation Reset", target: "Practice commas, periods, and quotes without rushing", progress: 35, completed: false });
  }
  if (predictions.some((item) => item.includes("key cluster"))) {
    missions.push({ title: "Weak-Key Forge", target: predictions.find((item) => item.includes("key cluster")), progress: 25, completed: false });
  }
  return missions.slice(0, 4);
};

const buildAchievements = (profile, results) => {
  const existing = new Set((profile.achievements || []).map((item) => item.key));
  const unlocked = [...(profile.achievements || [])];
  const add = (key, title) => {
    if (!existing.has(key)) unlocked.push({ key, title, unlockedAt: new Date() });
  };
  if (results.length >= 1) add("first-forge", "First Forge Complete");
  if (Math.max(0, ...results.map((item) => item.wpm || 0)) >= 60) add("speed-60", "60 WPM Breakthrough");
  if (results.some((item) => item.accuracy >= 98)) add("precision-98", "98% Precision Run");
  if (results.length >= 10) add("ten-runs", "Ten Session Streak Builder");
  return unlocked;
};

export const updateLearningProfile = async (userId, results) => {
  const profile = await getProfile(userId);
  if (!results.length) {
    profile.skillScore = 0;
    profile.difficulty = 3;
    profile.plateauRisk = 0;
    profile.fatigueRisk = 0;
    profile.improvementVelocity = 0;
    profile.projectedWpm7Days = 0;
    profile.projectedAccuracy7Days = 0;
    profile.strongestSkills = [];
    profile.weakPatterns = [];
    profile.predictedWeakAreas = [];
    profile.weakKeyBank = [];
    profile.weakWordBank = [];
    profile.adaptiveMissions = [];
    profile.memory = {
      ...(profile.memory || {}),
      sessionCount: 0,
      lastRecommendation: "Complete your first run and I will build your learning profile.",
    };
    return saveProfile(profile);
  }
  const recent = last(results, 10);
  const velocity = slope(last(results, 6), "wpm");
  const accuracy = avg(recent, "accuracy");
  const consistency = avg(recent, "consistency");
  const averageWpm = avg(recent, "wpm");
  const skillScore = clamp(Math.round(avg(recent, "wpm") * 0.65 + accuracy * 0.25 + consistency * 0.2), 1, 100);
  const plateauRisk = clamp(velocity < 2 && results.length >= 5 ? 62 + Math.abs(velocity) * 6 : 18 - velocity * 3, 0, 100);
  const fatigueRisk = clamp(avg(last(results, 4), "backspaceCount") * 4 + Math.max(0, 78 - consistency), 0, 100);
  const difficultyDelta = accuracy > 96 && consistency > 82 && velocity >= 0 ? 1 : accuracy < 90 || consistency < 65 ? -1 : 0;
  profile.skillScore = skillScore;
  profile.difficulty = clamp((profile.difficulty || 3) + difficultyDelta, 1, 10);
  profile.plateauRisk = Math.round(plateauRisk);
  profile.fatigueRisk = Math.round(fatigueRisk);
  profile.improvementVelocity = velocity;
  profile.projectedWpm7Days = Math.round(clamp(averageWpm + Math.max(1, velocity || 1) * 1.8, averageWpm, averageWpm + 18));
  profile.projectedAccuracy7Days = Math.round(clamp(accuracy + Math.max(1, (100 - accuracy) * 0.28), accuracy, 99));
  profile.strongestSkills = [
    accuracy >= 96 ? "accuracy discipline" : "",
    consistency >= 82 ? "stable rhythm" : "",
    avg(recent, "wpm") >= 60 ? "speed foundation" : "",
  ].filter(Boolean);
  profile.weakPatterns = [detectRhythm(results), ...top(recent, "weakWords", "word").slice(0, 3)];
  profile.predictedWeakAreas = predictWeakAreas(results);
  profile.weakKeyBank = topEntries(results, "weakKeys", "key");
  profile.weakWordBank = topEntries(results, "weakWords", "word");
  profile.adaptiveMissions = buildMissions(profile, results);
  profile.achievements = buildAchievements(profile, results);
  profile.memory = {
    ...(profile.memory || {}),
    sessionCount: results.length,
    lastRecommendation: chooseRecommendation(profile),
  };
  return saveProfile(profile);
};

export const chooseRecommendation = (profile) => {
  if ((profile.predictedWeakAreas || []).some((item) => item.includes("punctuation"))) return "Run a short Everyday session with punctuation pressure.";
  if (profile.fatigueRisk > 65) return "Drop difficulty for one run and rebuild rhythm cleanly.";
  if (profile.plateauRisk > 60) return "Use Challenge mode with accuracy-first pacing, not raw speed.";
  if (profile.difficulty >= 7) return "Increase sentence length and introduce mixed punctuation.";
  return "Stay balanced: one natural paragraph, then one focused weak-key drill.";
};

export const getAdaptiveProfile = async (userId, results) => updateLearningProfile(userId, results);

export const buildAdaptiveSession = async ({ userId, mode = "everyday", results = [] }) => {
  const profile = await updateLearningProfile(userId, results);
  return {
    mode,
    difficulty: profile.difficulty,
    focus: profile.predictedWeakAreas?.[0] || profile.weakPatterns?.[0] || "balanced fundamentals",
    weakKeys: top(last(results, 8), "weakKeys", "key"),
    weakWords: top(last(results, 8), "weakWords", "word"),
    targetAccuracy: profile.difficulty > 6 ? 96 : 94,
    targetWpm: Math.max(25, Math.round(avg(last(results, 5), "wpm") + (profile.difficulty > 5 ? 4 : 2))),
    recommendation: chooseRecommendation(profile),
  };
};

const localCoach = ({ result, profile, tone = "friendly" }) => {
  const notes = [];
  if (result.accuracy < 92) notes.push("Your speed is leaking through accuracy. Slow the first third of the next run and let the rhythm settle.");
  if ((result.punctuationErrors || 0) > 0) notes.push("You lose time around punctuation. Treat commas and periods as rhythm checkpoints instead of interruptions.");
  if ((result.hesitationCount || 0) > 7) notes.push("There are hesitation spikes before harder transitions. The next session should repeat those transitions in natural sentences.");
  if ((result.backspaceCount || 0) > 10) notes.push("Backspace use is high. Aim for one clean line where you accept small mistakes and protect flow.");
  if (!notes.length) notes.push("Strong run. Your next gain comes from slightly longer sentences and a little more punctuation pressure.");
  const projection = profile?.projectedWpm7Days
    ? `If you practice consistently for a week, a realistic target is around ${profile.projectedWpm7Days} WPM with ${profile.projectedAccuracy7Days || 95}% accuracy.`
    : "Complete a few runs and I will estimate your one-week WPM and accuracy range.";
  const message = `${notes[0]} ${profile?.lastRecommendation || chooseRecommendation(profile || {})} ${projection}`;
  if (tone === "savage") return `Brutal truth: ${message} Stop feeding the backspace key and earn the speed.`;
  if (tone === "military") return `Discipline protocol: ${message} Next run: eyes forward, steady pace, zero panic.`;
  return message;
};

export const generateCoachAdvice = async ({ result, profile, tone = "friendly" }) => {
  const provider = process.env.AI_PROVIDER;
  const apiKey = process.env.AI_API_KEY;
  if (!provider || !apiKey) return { source: "local-ai", message: localCoach({ result, profile, tone }) };

  try {
    const response = await fetch(process.env.AI_BASE_URL || "https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: `You are TypoToxic, a concise adaptive typing coach. Tone mode: ${tone}. Give specific, non-repetitive advice in 2 sentences.` },
          { role: "user", content: JSON.stringify({ result, profile, tone }) },
        ],
      }),
    });
    const data = await response.json();
    return { source: provider, message: data.choices?.[0]?.message?.content || localCoach({ result, profile, tone }) };
  } catch {
    return { source: "local-ai-fallback", message: localCoach({ result, profile, tone }) };
  }
};
