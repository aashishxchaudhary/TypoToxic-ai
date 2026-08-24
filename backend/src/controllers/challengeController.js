import crypto from "crypto";
import ChallengeResult from "../models/ChallengeResult.js";
import { usingMemoryDb } from "../config/db.js";
import { memoryStore } from "../config/memoryStore.js";

export const createChallenge = async (req, res) => {
  const { challengeType, completed, score } = req.body;
  if (!challengeType) return res.status(400).json({ message: "Challenge type is required" });
  const payload = { userId: req.user._id, challengeType, completed: Boolean(completed), score: score || 0 };
  const challenge = usingMemoryDb
    ? { ...payload, _id: crypto.randomUUID(), createdAt: new Date() }
    : await ChallengeResult.create(payload);
  if (usingMemoryDb) memoryStore.challenges.push(challenge);
  res.status(201).json({ challenge });
};

export const getMyChallenges = async (req, res) => {
  const challenges = usingMemoryDb
    ? memoryStore.challenges.filter((item) => item.userId === req.user._id)
    : await ChallengeResult.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ challenges });
};
