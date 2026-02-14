import mongoose from "mongoose";

const academicYearSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

export default AcademicYear;
