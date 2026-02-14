import express from "express";
import {
  createAcademicYear,
  getAcademicYears
} from "../controllers/calendarController.js";

const router = express.Router();

router.post("/academic-year", createAcademicYear);
router.get("/academic-year", getAcademicYears);

export default router;
