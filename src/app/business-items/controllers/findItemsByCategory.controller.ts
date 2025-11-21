/**
 * Find Items By Category Controller
 * Handles HTTP request for retrieving items by category
 */

import { Request, Response, NextFunction } from 'express';
import { findItemsByCategory } from '../services/findItemsByCategory.js';
import { ItemCategory } from '../models/business-item.model.js';

/**
 * Get all items with a specific category
 * @route GET /api/business-items/category/:category
 *
 * @example
 * GET /api/business-items/category/seafood
 * GET /api/business-items/category/meat?businessId=uuid
 */
export const findItemsByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.params;
    const { businessId } = req.query;

    const result = await findItemsByCategory(
      category as ItemCategory,
      businessId as string | undefined
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
