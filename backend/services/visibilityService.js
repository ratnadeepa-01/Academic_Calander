import { ROLES } from '../utils/constants.js';

/**
 * Returns a MongoDB query filter based on the user's role and department.
 * @param {Object} user - The logged-in user object (req.user)
 * @returns {Object} - MongoDB query object
 */
export const getDepartmentFilter = (user) => {
  if (!user) return {}; // Or throw error

  // ADMIN and PRINCIPAL: Full visibility
  if (user.role.name === ROLES.ADMIN || user.role.name === ROLES.PRINCIPAL) {
    return {};
  }

  // HOD and STAFF: Restricted to their department
  if (user.role.name === ROLES.HOD || user.role.name === ROLES.STAFF) {
    return { department: user.department };
  }

  // STUDENT: Restricted to their department (usually) or self.
  // The prompt says "STUDENT -> Only self access" which acts more on specific records?
  // But for "Department Filter", if a student lists activities, they probably see their dept's activities.
  // The prompt says "STUDENT -> Only own id" under VISIBILITY ENGINE.
  // But "HOD -> Department-restricted".
  
  // Let's stick to the prompt's VISIBILITY ENGINE section:
  // "HOD -> Filter by own department"
  // "STAFF -> Filter by own department"
  // "STUDENT -> Only own id"
  
  if (user.role.name === ROLES.STUDENT) {
      // If we are filtering "records" that belong to a department, maybe this is fine.
      // But if we are filtering "users" or "activities", strict "own id" might be for user lists.
      // For now, I will return a filter that matches the prompt logic for "Visibility Engine".
      return { _id: user._id };
  }

  return { _id: user._id }; // Default fallback to self
};

export const getStudentVisibilityFilter = (user) => {
    if (user.role.name === ROLES.ADMIN || user.role.name === ROLES.PRINCIPAL) {
        return {};
    }
    if (user.role.name === ROLES.HOD || user.role.name === ROLES.STAFF) {
        return { department: user.department, role: { $in: [ /* Fetch Role ID for STUDENT */ ] } }; 
        // Note: We need the Role ID for Student here. 
        // Ideally we pass it in or query it. 
        // Since I don't want to make this async if possible, or I accept it is async?
        // Let's make it return a filter object that assumes we have joined or similar?
        // Or we just filter by department. filtering for "Users who are students" is usually done in the controller.
        // This filter is for "What data can I see".
        return { department: user.department };
    }
    if (user.role.name === ROLES.STUDENT) {
        return { _id: user._id };
    }
    return { _id: user._id };
};
