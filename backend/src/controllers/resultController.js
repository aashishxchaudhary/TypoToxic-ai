import crypto from "crypto";
import TypingResult from "../models/TypingResult.js";
import { usingMemoryDb } from "../config/db.js";
import { memoryStore, publicUser } from "../config/memoryStore.js";
import { calculateLevel, calculateXp } from "../utils/calculateLevel.js";
import { updateLearningProfile } from "../services/aiService.js";

const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);
const yesterdayKey = () => todayKey(new Date(Date.now() - 86400000));

const updateUserProgress = async (user, result) => {
  const xpEarned = calculateXp(result);
  user.xp = (user.xp || 0) + xpEarned;
  user.level = calculateLevel(user.xp);
  const lastActive = user.lastActiveDate ? todayKey(new Date(user.lastActiveDate)) : "";
  if (lastActive !== todayKey()) {
    user.streak = lastActive === yesterdayKey() ? (user.streak || 0) + 1 : 1;
    user.lastActiveDate = new Date();
  }
  if (!usingMemoryDb) await user.save();
  return xpEarned;
};

export const createResult = async (req, res) => {
  const { mode, duration, wpm, accuracy } = req.body;
  if (!mode || !duration || wpm == null || accuracy == null) {
    return res.status(400).json({ message: "Mode, duration, WPM, and accuracy are required" });
  }
  const payload = { ...req.body, userId: req.user._id };
  const result = usingMemoryDb
    ? { ...payload, _id: crypto.randomUUID(), createdAt: new Date() }
    : await TypingResult.create(payload);
  if (usingMemoryDb) memoryStore.results.push(result);
  const xpEarned = await updateUserProgress(req.user, result);
  const allResults = usingMemoryDb
    ? memoryStore.results.filter((item) => item.userId === req.user._id)
    : await TypingResult.find({ userId: req.user._id }).sort({ createdAt: 1 });
  const profile = await updateLearningProfile(req.user._id, allResults);
  res.status(201).json({ result, xpEarned, user: publicUser(req.user), profile });
};

export const getMyResults = async (req, res) => {
  const results = usingMemoryDb
    ? memoryStore.results.filter((result) => result.userId === req.user._id)
    : await TypingResult.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ results: [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50) });
};

const topEntries = (results, field, itemKey) => {
  const counts = {};
  results.flatMap((result) => result[field] || []).forEach((item) => {
    const key = typeof item === "string" ? item : item[itemKey];
    counts[key] = (counts[key] || 0) + (item.count || 1);
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key, count]) => ({ [itemKey]: key, count }));
};

export const getStats = async (req, res) => {
  const results = usingMemoryDb
    ? memoryStore.results.filter((result) => result.userId === req.user._id)
    : await TypingResult.find({ userId: req.user._id }).sort({ createdAt: 1 });
  const count = results.length;
  const average = (field) => count ? Math.round(results.reduce((sum, result) => sum + (result[field] || 0), 0) / count) : 0;
  res.json({
    latestWpm: count ? results.at(-1).wpm : 0,
    bestWpm: count ? Math.max(...results.map((result) => result.wpm)) : 0,
    averageWpm: average("wpm"),
    averageAccuracy: average("accuracy"),
    totalTests: count,
    weakKeys: topEntries(results, "weakKeys", "key"),
    weakWords: topEntries(results, "weakWords", "word"),
    history: results.slice(-12).map((result, index) => ({ test: index + 1, wpm: result.wpm, accuracy: result.accuracy })),
    aiProfile: await updateLearningProfile(req.user._id, results),
    user: publicUser(req.user),
  });
};
