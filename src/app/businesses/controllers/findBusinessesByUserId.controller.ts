/**
 * Find Businesses By User ID Controller
 * Handles HTTP request for retrieving businesses owned by a user
 */

import { Request, Response, NextFunction } from 'express';
import { findBusinessesByUserId } from '../services/findBusinessesByUserId.js';

/**
 * Get all businesses owned by a user
 * @route GET /api/businesses/user/:userId
 */
export const findBusinessesByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await findBusinessesByUserId(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
