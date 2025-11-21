/**
 * Find Vegetarian Items Controller
 * Handles HTTP request for retrieving vegetarian items
 */

import { Request, Response, NextFunction } from 'express';
import { findVegetarianItems } from '../services/findVegetarianItems.js';

/**
 * Get all vegetarian items
 * @route GET /api/business-items/vegetarian
 *
 * @example
 * GET /api/business-items/vegetarian
 * GET /api/business-items/vegetarian?businessId=uuid
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
