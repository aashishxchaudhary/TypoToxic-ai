import mongoose from "mongoose";

const learningProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    skillScore: { type: Number, default: 35 },
    difficulty: { type: Number, default: 3 },
    plateauRisk: { type: Number, default: 0 },
    fatigueRisk: { type: Number, default: 0 },
    improvementVelocity: { type: Number, default: 0 },
    projectedWpm7Days: { type: Number, default: 0 },
    projectedAccuracy7Days: { type: Number, default: 0 },
    strongestSkills: [String],
    weakPatterns: [String],
    predictedWeakAreas: [String],
    weakKeyBank: [{ key: String, count: Number }],
    weakWordBank: [{ word: String, count: Number }],
    adaptiveMissions: [
      {
        title: String,
        target: String,
        progress: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
      },
    ],
    achievements: [
      {
        key: String,
        title: String,
        unlockedAt: Date,
      },
    ],
    memory: {
      preferredMode: { type: String, default: "everyday" },
      lastRecommendation: String,
      antiRepeatSeeds: [String],
      sessionCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("LearningProfile", learningProfileSchema);
