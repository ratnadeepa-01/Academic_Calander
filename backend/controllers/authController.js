import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email }).populate('role department');

      if (user && (await user.matchPassword(password))) {
        if (!user.isActive) {
            return res.status(401).json({ message: 'User is deactivated' });
        }

        if (!user.role) {
            return res.status(500).json({ message: 'User role not found or invalid' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role.name,
            department: user.department ? user.department.code : null,
            mustChangePassword: user.mustChangePassword,
            token: generateToken(user._id, user.role._id, user.department ? user.department._id : null),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
        const user = await User.findById(req.user._id);
      
        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword; // Will be hashed by pre-save
            user.mustChangePassword = false;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
