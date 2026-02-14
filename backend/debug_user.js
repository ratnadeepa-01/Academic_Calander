import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Role from './models/Role.js'; // Ensure Role registered
import connectDB from './config/db.js';

dotenv.config();

import fs from 'fs';

const log = (msg) => {
    fs.appendFileSync('debug_user_log.txt', msg + '\n');
    console.log(msg);
};

const debugUser = async () => {
    try {
        log('Connecting...');
        await connectDB();
        log('Connected');

        const user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            log('User not found: test@example.com');
             const anyUser = await User.findOne({});
            if (anyUser) {
                log('Found a user: ' + JSON.stringify(anyUser, null, 2));
                log('Role ID: ' + anyUser.role);
                const role = await Role.findById(anyUser.role);
                log('Role found: ' + JSON.stringify(role, null, 2));
            } else {
                log('No users found at all.');
            }
        } else {
            log('User found: ' + JSON.stringify(user, null, 2));
            log('Role populating...');
            await user.populate('role');
            log('User with role populated: ' + JSON.stringify(user, null, 2));
        }
        process.exit();
    } catch (error) {
        log('Error: ' + error);
        process.exit(1);
    }
};

debugUser();
