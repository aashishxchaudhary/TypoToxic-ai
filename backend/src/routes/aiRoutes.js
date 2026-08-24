import { Router } from "express";
import { coach, getAdaptiveSession, getProfile } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.get("/profile", getProfile);
router.get("/session", getAdaptiveSession);
router.post("/coach", coach);

export default router;
