import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Requires valid JWT)
router.route('/profile').get(protect, getUserProfile);

// Admin-only route
router.route('/').get(protect, admin, getUsers);

export default router;
