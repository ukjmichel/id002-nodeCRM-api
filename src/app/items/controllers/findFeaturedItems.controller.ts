/**
 * Find Featured Items Controller
 * Handles HTTP request for retrieving featured items
 */

import { Request, Response, NextFunction } from 'express';
import { findFeaturedItems } from '../services/findFeaturedItems.js';

/**
 * Get all featured items
 * @route GET /api/items/featured
 *
 * @example
 * GET /api/items/featured
 * GET /api/items/featured?businessId=uuid
 */
export const findFeaturedItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findFeaturedItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
