/**
 * Delete Business Item Controller
 * Handles HTTP request for deleting a business item with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { deleteBusinessItem } from '../services/deleteBusinessItem.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Delete a business item by ID
 * @route DELETE /api/business-items/:id
 * @access Private
 *
 * @example
 * DELETE /api/business-items/123e4567-e89b-12d3-a456-426614174000
 */
export const deleteBusinessItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Perform deletion within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await deleteBusinessItem(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
