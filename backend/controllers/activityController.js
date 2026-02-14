import Activity from "../models/Activity.js";

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
      }

      else if (scope === "department") {
        overlapQuery.department = department;
      }

      else if (scope === "individual") {
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
      overlapType
    });

    await newActivity.save();

    res.status(201).json({
      message: "Activity Created Successfully",
      data: newActivity
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ACTIVITIES (You forgot this earlier)
export const getActivities = async (req, res) => {
  try {

    const user = req.user;
    const roleName = user.role.name;
    const userDepartmentId = user.department?._id;
    const userId = user._id;

    let filter = {};

    // Admin sees everything
    if (roleName === "Admin") {
      filter = {};
    }

    // HOD sees institution + department activities
    else if (roleName === "HOD") {
      filter = {
        $or: [
          { scope: "institution" },
          { department: userDepartmentId }
        ]
      };
    }

    // Staff sees institution + department + assigned activities
    else if (roleName === "Staff") {
      filter = {
        $or: [
          { scope: "institution" },
          { department: userDepartmentId },
          { assignedTo: userId }
        ]
      };
    }

    // Student sees institution + department + assigned activities
    else if (roleName === "Student") {
      filter = {
        $or: [
          { scope: "institution" },
          { department: userDepartmentId },
          { assignedTo: userId }
        ]
      };
    }

    const activities = await Activity.find(filter)
      .populate("academicYearId");

    res.status(200).json(activities);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
