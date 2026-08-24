import mongoose from "mongoose";

const challengeResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeType: { type: String, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("ChallengeResult", challengeResultSchema);
