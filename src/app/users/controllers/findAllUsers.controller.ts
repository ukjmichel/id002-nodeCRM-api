/**
 * Find All Users Controller
 * Handles HTTP request for retrieving all users with filters
 */

import { Request, Response, NextFunction } from 'express';
import { findAllUsers } from '../services/findAllUsers.js';

/**
 * Get all users with optional filters and pagination
 * @route GET /api/users
 */
export const findAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { where, limit, offset, order, include } = req.query;
    
    const options = {
      ...(where && { where: JSON.parse(where as string) }),
      ...(limit && { limit: parseInt(limit as string, 10) }),
      ...(offset && { offset: parseInt(offset as string, 10) }),
      ...(order && { order: JSON.parse(order as string) }),
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findAllUsers(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
