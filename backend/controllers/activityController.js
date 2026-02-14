import Activity from "../models/Activity.js";
import AuditLog from "../models/AuditLog.js";

export const createActivity = async (req, res) => {
  try {
    const {
      title,
      category,
      subCategory,
      startDate,
      endDate,
      scope,
      department,
      academicYearId,
      overlapType
    } = req.body;

    // STEP 1: Find overlapping activities
    // STEP 1: Build base overlap query
    let overlapQuery = {
      academicYearId,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    };

    // STEP 2: Modify query based on scope
    if (scope === "institution") {
      // conflict across whole academic year (no extra condition)
    } else if (scope === "department") {
      overlapQuery.department = department;
    } else if (scope === "individual") {
      overlapQuery.assignedTo = { $in: req.body.assignedTo || [] };
    }

    // STEP 3: Find overlapping activities
    const overlappingActivities = await Activity.find(overlapQuery);

    // STEP 2: If any overlapping activity exists and rule is mandatory → block
    if (overlapType === "mandatory" && overlappingActivities.length > 0) {
      return res.status(400).json({
        message: "Activity overlaps with existing activity. Creation blocked.",
        overlappingActivities
      });
    }

    // STEP 3: Create activity
    const newActivity = new Activity({
      title,
      category,
      subCategory,
      startDate,
      endDate,
      scope,
      department,
      academicYearId,
      overlapType,
      createdBy: req.user._id
    });

    await newActivity.save();

    // Log action
    await AuditLog.create({
      userId: req.user._id,
      action: "CREATE_ACTIVITY",
      entityType: "Activity",
      entityId: newActivity._id
    });

    res.status(201).json({
      message: "Activity Created Successfully",
      data: newActivity
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check ownership
    if (
      req.user.role.name !== "Admin" &&
      activity.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this activity" });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Log action
    await AuditLog.create({
      userId: req.user._id,
      action: "UPDATE_ACTIVITY",
      entityType: "Activity",
      entityId: updatedActivity._id
    });

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ACTIVITIES
export const getActivities = async (req, res) => {
  try {
    let query = {};
    const userRole = req.user.role.name;
    const userDept = req.user.department?.code; // Assuming Activity.department stores the code

    if (userRole === "Admin") {
      // Admin sees all
      query = {};
    } else if (userRole === "HOD") {
      // HOD sees department activities
      query = { department: userDept };
    } else if (userRole === "Staff") {
      // Staff sees department activities OR assigned activities
      query = {
        $or: [
          { department: userDept },
          { assignedTo: req.user._id }
        ]
      };
    } else if (userRole === "Student") {
      // Student sees institution wide or department activities
      query = {
        $or: [
           { scope: "institution" },
           { department: userDept }
        ]
      };
    } else {
        // Fallback for unknown roles (e.g. Guest?)
        query = { scope: "institution" };
    }

    const activities = await Activity.find(query).populate("academicYearId");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};