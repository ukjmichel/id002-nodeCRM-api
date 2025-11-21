/**
 * Bulk Create Business Items Controller
 * Handles HTTP request for creating multiple business items with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { bulkCreateBusinessItems } from '../services/bulkCreateBusinessItems.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Bulk create business items
 * @route POST /api/business-items/bulk
 * @access Private
 *
 * @example
 * POST /api/business-items/bulk
 * Body: {
 *   "items": [
 *     {
 *       "businessId": "business-uuid",
 *       "name": "Margherita Pizza",
 *       "type": "food",
 *       "price": 12.99,
 *       "isVegetarian": true
 *     },
 *     {
 *       "businessId": "business-uuid",
 *       "name": "Coca Cola",
 *       "type": "drink",
 *       "price": 2.99
 *     }
 *   ],
 *   "validate": true,
 *   "ignoreDuplicates": false
 * }
 */
export const bulkCreateBusinessItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract items array and options from request body
    const { items, validate, ignoreDuplicates, updateOnDuplicate } = req.body;

    // Perform bulk creation within a transaction for data integrity
    // If any item fails validation or creation, all will be rolled back
    const result = await withTransaction(async (transaction) => {
      return await bulkCreateBusinessItems(items, {
        transaction,
        validate: validate !== undefined ? validate : true,
        ignoreDuplicates: ignoreDuplicates || false,
        updateOnDuplicate: updateOnDuplicate,
      });
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
