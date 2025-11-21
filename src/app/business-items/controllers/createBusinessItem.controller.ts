/**
 * Create Business Item Controller
 * Handles HTTP request for creating a new business item with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { createBusinessItem } from '../services/createBusinessItem.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Create a new business item
 * @route POST /api/business-items
 * @access Private
 *
 * @example
 * POST /api/business-items
 * Body: {
 *   "businessId": "business-uuid",
 *   "name": "Margherita Pizza",
 *   "type": "food",
 *   "price": 12.99,
 *   "isVegetarian": true,
 *   "isHalal": false,
 *   "containsWheat": true,
 *   "containsMilk": true
 * }
 */
export const createBusinessItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Perform creation within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await createBusinessItem(req.body, { transaction });
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
