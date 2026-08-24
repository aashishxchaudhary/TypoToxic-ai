import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: String, default: "Keyboard Victim" },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
