import express from 'express';
import { loginUser, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.put('/update-password', protect, updatePassword);

export default router;
