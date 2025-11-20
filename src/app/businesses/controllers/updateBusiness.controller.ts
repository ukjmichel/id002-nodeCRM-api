/**
 * Update Business Controller
 * Handles HTTP request for updating a business with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { updateBusiness } from '../services/updateBusiness.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Update a business by ID
 * @route PUT /api/businesses/:id
 * @access Private
 *
 * @example
 * PUT /api/businesses/123e4567-e89b-12d3-a456-426614174000
 * Body: {
 *   "tradeName": "New Trade Name",
 *   "active": false
 * }
 */
export const updateBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Perform update within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await updateBusiness(id, req.body, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
