import Role from '../models/Role.js';
import Permission from '../models/Permission.js';

export const getRoleByName = async (roleName) => {
  return await Role.findOne({ name: roleName }).populate('permissions');
};

export const getRoles = async () => {
    return await Role.find({}).populate('permissions');
};

export const createRole = async (name, permissionIds) => {
    const role = await Role.create({ name, permissions: permissionIds });
    return role;
}
