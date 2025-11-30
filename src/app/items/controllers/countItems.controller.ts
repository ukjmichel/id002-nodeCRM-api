/**
 * Count Business Items Controller
 * Handles HTTP request for counting business items
 */

import { Request, Response, NextFunction } from 'express';
import { countItems } from '../services/countItems.js';

/**
 * Count business items with optional filters
 * @route GET /api/business-items/count
 *
 * @example
 * GET /api/business-items/count
 * GET /api/business-items/count?where={"available":true,"isVegan":true}
 */
export const countItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { where } = req.query;

    const whereClause = where ? JSON.parse(where as string) : {};

    const result = await countItems(whereClause);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
