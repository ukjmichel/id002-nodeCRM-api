/**
 * Find Vegetarian Items Controller
 * Handles HTTP request for retrieving vegetarian items
 */

import { Request, Response, NextFunction } from 'express';
import { findVegetarianItems } from '../services/findVegetarianItems.js';

/**
 * Get all vegetarian items
 * @route GET /api/items/vegetarian
 *
 * @example
 * GET /api/items/vegetarian
 * GET /api/items/vegetarian?businessId=uuid
 */
export const findVegetarianItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findVegetarianItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
