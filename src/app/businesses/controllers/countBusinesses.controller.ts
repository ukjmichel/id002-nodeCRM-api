/**
 * Count Businesses Controller
 * Handles HTTP request for counting businesses
 */

import { Request, Response, NextFunction } from 'express';
import { countBusinesses } from '../services/countBusinesses.js';

/**
 * Count businesses with optional filters
 * @route GET /api/businesses/count
 */
export const countBusinessesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { where } = req.query;

    const whereClause = where ? JSON.parse(where as string) : {};

    const result = await countBusinesses(whereClause);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
