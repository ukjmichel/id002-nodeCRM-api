/**
 * Update Business Item Controller
 * Handles HTTP request for updating a business item with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { updateItem } from '../services/updateItem.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Update a business item by ID
 * @route PUT /api/items/:id
 * @access Private
 *
 * @example
 * PUT /api/items/123e4567-e89b-12d3-a456-426614174000
 * Body: {
 *   "price": 14.99,
 *   "available": false,
 *   "isVegan": true
 * }
 */
export const updateItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Perform update within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await updateItem(id, req.body, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
