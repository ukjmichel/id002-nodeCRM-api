// src/app/auth/controllers/me.controller.ts
/**
 * Get Current User Controller
 * Returns authenticated user information
 */

import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../../users/services/findUserById.js';

/**
 * Get current authenticated user
 * @route GET /api/auth/me
 * @access Private (requires authentication)
 * @description Returns current user info from token payload
 */
export const meController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // User payload should be attached by auth middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Get fresh user data from database
    const userResponse = await findUserById(req.user.userId);
    const user = userResponse.data;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verified: user.verified,
        },
      },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
