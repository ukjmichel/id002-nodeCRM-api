/**
 * Find All Business Items Controller
 * Handles HTTP request for retrieving all business items with filters
 */

import { Request, Response, NextFunction } from 'express';
import { findAllItems } from '../services/findAllItems.js';

/**
 * Get all business items with optional filters and pagination
 * @route GET /api/items
 *
 * @example
 * GET /api/items?limit=10&offset=0&where={"available":true}
 */
export const findAllItemsController = async (
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

    const result = await findAllItems(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
