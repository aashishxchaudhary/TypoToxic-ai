import { Router } from "express";
import { createResult, getMyResults, getStats } from "../controllers/resultController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);
router.post("/", createResult);
router.get("/me", getMyResults);
router.get("/stats", getStats);
export default router;
