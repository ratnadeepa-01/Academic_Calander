import express from 'express';
import { createUser, getUsers, softDeleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.route('/')
    .post(protect, authorizeRoles(ROLES.ADMIN), createUser)
    .get(protect, getUsers);

router.route('/:id')
    .delete(protect, authorizeRoles(ROLES.ADMIN), softDeleteUser);

export default router;
