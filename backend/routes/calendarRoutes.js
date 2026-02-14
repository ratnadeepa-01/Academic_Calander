import express from "express";
import {
  createAcademicYear,
  getAcademicYears
} from "../controllers/calendarController.js";

const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

router.post("/academic-year", protect, authorizeRoles("Admin"), createAcademicYear);
router.get("/academic-year", getAcademicYears);

export default router;
