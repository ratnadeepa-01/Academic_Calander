import connectDB from './config/db.js';
import dotenv from 'dotenv';

console.log('Script started');
dotenv.config();
console.log('Dotenv loaded');

const test = async () => {
    console.log('Calling connectDB...');
    try {
        await connectDB();
        console.log('connectDB returned');
        process.exit(0);
    } catch (e) {
        console.error('connectDB failed', e);
        process.exit(1);
    }
};

test();
