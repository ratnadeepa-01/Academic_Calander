import express from "express";
import { createActivity, getActivities } from "../controllers/activityController.js";

const router = express.Router();

router.post("/activity", createActivity);
router.get("/activity", getActivities);

export default router;

