/**
 * Search Business Items Controller
 * Handles HTTP request for searching business items with advanced criteria
 */

import { Request, Response, NextFunction } from 'express';
import { searchBusinessItems } from '../services/searchBusinessItems.js';
import { BusinessItemSearchCriteria } from '../interfaces/business-item.interface.js';

/**
 * Search business items with advanced criteria
 * @route POST /api/business-items/search
 *
 * @example
 * POST /api/business-items/search
 * Body: {
 *   "query": "pizza",
 *   "businessId": "business-uuid",
 *   "type": ["food"],
 *   "isVegetarian": true,
 *   "excludeNuts": true,
 *   "excludePeanuts": true,
 *   "minPrice": 5,
 *   "maxPrice": 20,
 *   "available": true,
 *   "maxCalories": 500
 * }
 */
export const searchBusinessItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const criteria: BusinessItemSearchCriteria = req.body;

    const result = await searchBusinessItems(criteria);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
