import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const log = (msg) => {
    fs.appendFileSync('verify_log.txt', msg + '\n');
};

const run = async () => {
    try {
        log('Starting verification...');
        await connectDB();
        log('DB Connected');
        
        const userCount = await User.countDocuments();
        log(`User count: ${userCount}`);
        
        if (userCount === 0) {
            log('No users found. Running seeder logic...');
            // ... seeder logic here or just rely on manual seeder run?
            // User asked to create a user.
             // Create standard admin user if not exists
             const admin = await User.findOne({ email: 'admin@example.com' });
             if (!admin) {
                 // Create dummy role first?
                 // Seeder does a lot. I'll just check if seeder worked.
                 log('Seeder seemingly failed or not run.');
             } else {
                 log('Admin user found.');
             }
        } else {
            const users = await User.find({});
            log(`Found users: ${JSON.stringify(users.map(u => u.email))}`);
        }
        
        process.exit(0);
    } catch (e) {
        log(`Error: ${e.message}`);
        process.exit(1);
    }
};

run();
