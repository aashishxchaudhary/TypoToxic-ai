import TypingResult from "../models/TypingResult.js";
import { usingMemoryDb } from "../config/db.js";
import { memoryStore } from "../config/memoryStore.js";
import { buildAdaptiveSession, generateCoachAdvice, getAdaptiveProfile } from "../services/aiService.js";

const userResults = async (userId) =>
  usingMemoryDb
    ? memoryStore.results.filter((result) => result.userId === userId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : TypingResult.find({ userId }).sort({ createdAt: 1 });

export const getProfile = async (req, res) => {
  const results = await userResults(req.user._id);
  const profile = await getAdaptiveProfile(req.user._id, results);
  res.json({ profile });
};

export const getAdaptiveSession = async (req, res) => {
  const results = await userResults(req.user._id);
  const session = await buildAdaptiveSession({ userId: req.user._id, mode: req.query.mode || "everyday", results });
  res.json({ session });
};

export const coach = async (req, res) => {
  const results = await userResults(req.user._id);
  const profile = await getAdaptiveProfile(req.user._id, results);
  const advice = await generateCoachAdvice({ result: req.body.result || results.at(-1) || {}, profile, tone: req.body.tone || "friendly" });
  res.json({ advice, profile });
};
