import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  yearOfStudy: {
    type: Number,
    // Only for students, validation can be handled in controller or here
  },
  rollNumber: {
    type: String,
    // Only for students
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  mustChangePassword: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Middleware to hash password before saving
// Middleware to hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await hashPassword(this.password);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await comparePassword(enteredPassword, this.password);
};

// Soft delete policy: All queries must filter active users only.
// We can use a query middleware or just handle it in service/controller.
// "All queries must filter active users only." -> This implies I should perhaps add a pre-find hook?
// "Person A owns keys... Controls WHO can access WHAT... Visibility logic"
// "getDepartmentFilter(user), getStudentVisibilityFilter(user)"
// The prompt explicitly says "All queries must filter active users only."
// I will add a pre-find hook to exclude inactive users by default?
// But maybe Admin wants to see inactive users? "Admin... Can deactivate users".
// If I hide them globally, I can't reactivate them easily.
// I will NOT add a global pre-find hook that forces isActive: true, 
// because Admin might need to see them to reactivate.
// I will handle this in the `visibilityService` or specific controllers.

const User = mongoose.model('User', userSchema);
export default User;
