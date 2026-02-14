import AcademicYear from "../models/AcademicYear.js";
import AuditLog from "../models/AuditLog.js";

// Create Academic Year
export const createAcademicYear = async (req, res) => {
  try {
    const { academicYear, semester, yearOfStudy, department } = req.body;

    const newYear = new AcademicYear({
      academicYear,
      semester,
      yearOfStudy,
      department
    });

    await newYear.save();

    // Log action
    await AuditLog.create({
      userId: req.user._id,
      action: "CREATE_ACADEMIC_YEAR",
      entityType: "AcademicYear",
      entityId: newYear._id
    });

    res.status(201).json({
      message: "Academic Year Created Successfully",
      data: newYear
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Academic Years
export const getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find();
    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
