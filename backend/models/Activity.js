import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
    // Example: "Exam", "Holiday", "Staff Work", "Meeting"
  },

  subCategory: {
    type: String
    // Example: "PT1", "PT2", "Marksheet Correction", "Mentor Meeting"
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  scope: {
    type: String,
    enum: ["institution", "department", "individual"],
    required: true
  },

  department: {
    type: String
  },

  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  overlapType: {
    type: String,
    enum: ["mandatory", "allowed", "conditional"],
    default: "mandatory"
  },

  dependency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity"
  },

  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  priority: {
  type: Number,
  default: 5
}


}, { timestamps: true });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
