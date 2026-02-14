import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Role from './models/Role.js'; // Need to fetch role
import connectDB from './config/db.js';

dotenv.config();

const createAdmin = async () => {
    try {
        console.log('Connecting to DB...');
        await connectDB();
        console.log('Connected.');
        
        // Ensure Admin Role exists
        let adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            console.log('Admin Role not found. Creating...');
            adminRole = await Role.create({ name: 'Admin', permissions: [] });
        }
        
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
        } else {
            console.log('Creating Admin user...');
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: adminRole._id,
                department: new mongoose.Types.ObjectId(), // Mock Dept ID or fetch if needed
                mustChangePassword: true,
                isActive: true
            });
            console.log('Admin User created successfully!');
            console.log('Email: admin@example.com');
            console.log('Password: password123');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
