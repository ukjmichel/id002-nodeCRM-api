// src/app/auth/routes/auth.routes.ts
/**
 * Auth Routes
 * Defines authentication endpoints with cookie-based JWT authentication
 */

import { Router } from 'express';
import {
  loginController,
  registerController,
  logoutController,
  refreshController,
  meController,
} from '../controllers/index.js';
import { authMiddleware } from '../middlewares.ts/auth.middleware.js';


const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 * @body    { username, email, password, firstName, lastName }
 * @returns { success, data: { user }, message }
 * @cookies Sets access_token and refresh_token
 */
router.post('/register', registerController);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 * @returns { success, data: { user }, message }
 * @cookies Sets access_token and refresh_token
 */
router.post('/login', loginController);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookies)
 * @access  Public
 * @returns { success, data: null, message }
 * @cookies Clears access_token and refresh_token
 */
router.post('/logout', logoutController);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token from cookies
 * @access  Public (but requires valid refresh_token cookie)
 * @cookies Reads refresh_token, sets new access_token and refresh_token
 * @returns { success, message }
 */
router.post('/refresh', refreshController);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private (requires authentication)
 * @cookies Requires access_token
 * @returns { success, data: { user }, message }
 */
router.get('/me', authMiddleware, meController);

export default router;

// Alternative named export
export { router as authRoutes };
