/**
 * Find Halal Items Controller
 * Handles HTTP request for retrieving halal items
 */

import { Request, Response, NextFunction } from 'express';
import { findHalalItems } from '../services/findHalalItems.js';

/**
 * Get all halal items
 * @route GET /api/business-items/halal
 *
 * @example
 * GET /api/business-items/halal
 * GET /api/business-items/halal?businessId=uuid
 */
export const findHalalItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findHalalItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
