/**
 * Find Items By Business ID Controller
 * Handles HTTP request for retrieving items belonging to a business
 */

import { Request, Response, NextFunction } from 'express';
import { findItemsByBusinessId } from '../services/findItemsByBusinessId.js';

/**
 * Get all items for a specific business
 * @route GET /api/business-items/business/:businessId
 *
 * @example
 * GET /api/business-items/business/123e4567-e89b-12d3-a456-426614174000
 */
export const findItemsByBusinessIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const result = await findItemsByBusinessId(businessId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
