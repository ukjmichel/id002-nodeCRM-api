/**
 * Delete Business Controller
 * Handles HTTP request for deleting a business with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { deleteBusiness } from '../services/deleteBusiness.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Delete a business by ID
 * @route DELETE /api/businesses/:id
 * @access Private
 *
 * @example
 * DELETE /api/businesses/123e4567-e89b-12d3-a456-426614174000
 */
export const deleteBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Perform deletion within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await deleteBusiness(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
