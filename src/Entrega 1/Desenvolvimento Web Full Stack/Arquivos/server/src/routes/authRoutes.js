import express from 'express';
import {
  login,
  register,
  getMe,
  logout,
  changePassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login - Login
router.post('/login', login);

// POST /api/auth/register - Register
router.post('/register', register);

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, getMe);

// POST /api/auth/logout - Logout
router.post('/logout', logout);

// PUT /api/auth/change-password - Change password
router.put('/change-password', authenticateToken, changePassword);

export default router;
