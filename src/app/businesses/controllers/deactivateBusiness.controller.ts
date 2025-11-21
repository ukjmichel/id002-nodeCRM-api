/**
 * Deactivate Business Controller
 * Handles HTTP request for deactivating a business with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { deactivateBusiness } from '../services/deactivateBusiness.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Deactivate a business (set active to false)
 * @route PATCH /api/businesses/:id/deactivate
 * @access Private
 *
 * @example
 * PATCH /api/businesses/123e4567-e89b-12d3-a456-426614174000/deactivate
 * Body: {
 *   "closureDate": "2024-12-31" // Optional
 * }
 */
export const deactivateBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Parse closure date from request body if provided
    const { closureDate } = req.body || {};
    const parsedClosureDate = closureDate ? new Date(closureDate) : undefined;

    // Validate closure date format if provided
    if (closureDate && isNaN(parsedClosureDate!.getTime())) {
      throw new ValidationError(
        'Validation failed',
        'Invalid closure date format. Please use ISO 8601 format (YYYY-MM-DD)'
      );
    }

    // Perform deactivation within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await deactivateBusiness(id, parsedClosureDate, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
