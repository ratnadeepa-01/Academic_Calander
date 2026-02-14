import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const runTest = async () => {
  console.log('Starting test...');
  try {
    await connectDB();
    console.log('DB Connected');
    
    // Create a dummy user to test hooks
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: new mongoose.Types.ObjectId(), // Fake ID
      department: new mongoose.Types.ObjectId() // Fake ID
    });
    
    console.log('Saving user...');
    await user.save();
    console.log('User saved!');

    // await User.deleteOne({ email: 'test@example.com' });
    // console.log('User deleted!');
    
    process.exit();
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

runTest();
