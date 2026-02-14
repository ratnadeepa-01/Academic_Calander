import express from "express";
import { createActivity, getActivities } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/activity", protect, createActivity);
router.get("/activity", protect, getActivities);

export default router;
