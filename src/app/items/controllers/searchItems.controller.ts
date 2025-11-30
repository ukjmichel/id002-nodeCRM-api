/**
 * Search Business Items Controller
 * Handles HTTP request for searching business items with advanced criteria
 */

import { Request, Response, NextFunction } from 'express';
import { searchItems } from '../services/searchItems.js';
import { ItemSearchCriteria } from '../interfaces/item.interface.js';

/**
 * Search business items with advanced criteria
 * @route POST /api/items/search
 *
 * @example
 * POST /api/items/search
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
export const searchItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const criteria: ItemSearchCriteria = req.body;

    const result = await searchItems(criteria);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
