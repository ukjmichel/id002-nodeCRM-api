/**
 * Count Users Controller
 * Handles HTTP request for counting users
 */

import { Request, Response, NextFunction } from 'express';
import { countUsers } from '../services/countUsers.js';

/**
 * Count users with optional filters
 * @route GET /api/users/count
 *
 * @remarks
 * Count operations are read-only and don't require transactions.
 */
export const countUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { where } = req.query;

    const whereClause = where ? JSON.parse(where as string) : {};

    const result = await countUsers(whereClause);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
