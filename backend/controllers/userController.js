import User from '../models/User.js';
import { getDepartmentFilter } from '../services/visibilityService.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  const { name, email, password, role, department, yearOfStudy, rollNumber } = req.body;

  try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        department,
        yearOfStudy,
        rollNumber,
        mustChangePassword: true, // Force change on first login
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Filtered by Visibility)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
    try {
        const filter = getDepartmentFilter(req.user);
        
        // Also ensure we only get active users unless specified?
        // Prompt says "All queries must filter active users only."
        // But Admin might want to see deactivated users.
        // I'll assume for this general "getUsers" list, we show active ones.
        // Or if Admin, maybe show all?
        // Prompt: "ADMIN: Can deactivate users".
        // Let's add isActive: true to the filter for now, or handle it in client query params?
        // For Person A responsibilities, safeguarding queries is key.
        // "Soft delete policy: Users must never be permanently deleted... All queries must filter active users only."
        // I will interpret this as "Default visibility is active".
        
        const finalFilter = { ...filter, isActive: true };
        
        // If Admin wants to see inactive, they might need a different endpoint or param.
        // I'll stick to strict "active only" as per "All queries must filter active users only" instruction.
        
        const users = await User.find(finalFilter)
            .select('-password')
            .populate('role', 'name')
            .populate('department', 'name code');
            
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Soft delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const softDeleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isActive = false;
            await user.save();
            res.json({ message: 'User deactivated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}
