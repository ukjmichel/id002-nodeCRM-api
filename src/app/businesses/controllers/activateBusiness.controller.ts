/**
 * Activate Business Controller
 * Handles HTTP request for activating a business with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { activateBusiness } from '../services/activateBusiness.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Activate a business (set active to true)
 * @route PATCH /api/businesses/:id/activate
 * @access Private
 *
 * @example
 * PATCH /api/businesses/123e4567-e89b-12d3-a456-426614174000/activate
 */
export const activateBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Perform activation within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await activateBusiness(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
