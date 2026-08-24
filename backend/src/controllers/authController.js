import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { usingMemoryDb } from "../config/db.js";
import { memoryStore, publicUser } from "../config/memoryStore.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Name, email, and a 6+ character password are required" });
  }
  const normalizedEmail = email.toLowerCase().trim();
  const exists = usingMemoryDb
    ? memoryStore.users.some((user) => user.email === normalizedEmail)
    : await User.findOne({ email: normalizedEmail });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const userData = {
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    xp: 0,
    level: "Keyboard Victim",
    streak: 0,
  };
  const user = usingMemoryDb
    ? { ...userData, _id: crypto.randomUUID(), createdAt: new Date() }
    : await User.create(userData);
  if (usingMemoryDb) memoryStore.users.push(user);
  res.status(201).json({ token: generateToken(user._id), user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  const normalizedEmail = email.toLowerCase().trim();
  const user = usingMemoryDb
    ? memoryStore.users.find((item) => item.email === normalizedEmail)
    : await User.findOne({ email: normalizedEmail });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: generateToken(user._id), user: publicUser(user) });
};

export const getMe = async (req, res) => res.json({ user: publicUser(req.user) });
