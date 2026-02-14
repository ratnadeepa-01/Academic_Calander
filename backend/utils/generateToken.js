import jwt from 'jsonwebtoken';

export const generateToken = (userId, roleId, departmentId) => {
  return jwt.sign({ userId, roleId, departmentId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
