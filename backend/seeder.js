import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Role from './models/Role.js';
import Department from './models/Department.js';
import User from './models/User.js';
import Permission from './models/Permission.js';
import { ROLES } from './utils/constants.js';

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    await Role.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Permission.deleteMany();

    // Create Permissions (Example)
    const permissions = await Permission.insertMany([
        { name: 'create_user', description: 'Can create new users' },
        { name: 'view_users', description: 'Can view users' },
        // Add more as needed
    ]);

    // Create Roles
    // We map permissions to roles. For now, giving Admin all permissions.
    const adminPermissions = permissions.map(p => p._id);
    
    const roles = await Role.insertMany([
        { name: ROLES.ADMIN, permissions: adminPermissions },
        { name: ROLES.PRINCIPAL, permissions: [] }, // Add relevant permissions
        { name: ROLES.HOD, permissions: [] },
        { name: ROLES.STAFF, permissions: [] },
        { name: ROLES.STUDENT, permissions: [] },
    ]);
    
    const adminRole = roles.find(r => r.name === ROLES.ADMIN);

    // Create Departments
    const departments = await Department.insertMany([
        { name: 'Computer Science', code: 'CSE' },
        { name: 'Electronics', code: 'ECE' },
        { name: 'Mechanical', code: 'MECH' },
    ]);

    const cseDept = departments.find(d => d.code === 'CSE');

    // Create Admin User
    // Default password = DOB? Let's say 1990-01-01
    // We need to hash it. The User model pre-save hook handles hashing.
    await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Admin can change this
        role: adminRole._id,
        department: cseDept._id, // Admin belongs to a dept? Or null? Model says required.
        mustChangePassword: true,
        isActive: true
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Role.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Permission.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
