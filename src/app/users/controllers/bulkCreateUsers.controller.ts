/**
 * Bulk Create Users Controller
 * Handles HTTP request for creating multiple users
 */

import { Request, Response, NextFunction } from 'express';
import { bulkCreateUsers } from '../services/bulkCreateUsers.js';

/**
 * Bulk create users
 * @route POST /api/users/bulk
 */
export const bulkCreateUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { users } = req.body;
    const result = await bulkCreateUsers(users);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
