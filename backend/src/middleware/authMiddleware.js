import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { memoryStore } from "../config/memoryStore.js";
import { usingMemoryDb } from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = usingMemoryDb
      ? memoryStore.users.find((item) => item._id === userId)
      : await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
