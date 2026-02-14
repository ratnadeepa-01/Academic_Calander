import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Deep populate role and permissions for RBAC
      req.user = await User.findById(decoded.userId)
        .select('-password')
        .populate({
            path: 'role',
            populate: { path: 'permissions' }
        })
        .populate('department');

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      if (!req.user.isActive) {
          return res.status(401).json({ message: 'User is deactivated' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
