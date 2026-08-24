import { Router } from "express";
import { createChallenge, getMyChallenges } from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.post("/", createChallenge);
router.get("/me", getMyChallenges);
export default router;
