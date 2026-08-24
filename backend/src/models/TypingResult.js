import mongoose from "mongoose";

const typingResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mode: { type: String, required: true },
    duration: { type: Number, required: true },
    wpm: { type: Number, required: true },
    rawWpm: Number,
    accuracy: Number,
    correctChars: Number,
    wrongChars: Number,
    backspaceCount: Number,
    weakKeys: [{ key: String, count: Number }],
    weakWords: [{ word: String, count: Number }],
    mistakePatterns: [String],
    consistency: Number,
    punctuationErrors: { type: Number, default: 0 },
    capitalizationErrors: { type: Number, default: 0 },
    hesitationCount: { type: Number, default: 0 },
    rhythmBreaks: { type: Number, default: 0 },
    burstWpm: { type: Number, default: 0 },
    fatigueScore: { type: Number, default: 0 },
    comboBest: { type: Number, default: 0 },
    keyTimings: [
      {
        key: String,
        avgMs: Number,
        count: Number,
      },
    ],
    telemetry: {
      intervals: [Number],
      mistakeSequence: [String],
      hesitationIndexes: [Number],
    },
  },
  { timestamps: true },
);

export default mongoose.model("TypingResult", typingResultSchema);
