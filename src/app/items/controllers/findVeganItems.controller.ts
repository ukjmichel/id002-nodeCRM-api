/**
 * Find Vegan Items Controller
 * Handles HTTP request for retrieving vegan items
 */

import { Request, Response, NextFunction } from 'express';
import { findVeganItems } from '../services/findVeganItems.js';

/**
 * Get all vegan items
 * @route GET /api/items/vegan
 *
 * @example
 * GET /api/items/vegan
 * GET /api/items/vegan?businessId=uuid
 */
export const findVeganItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findVeganItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
