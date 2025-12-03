/**
 * Find Halal Items Controller
 * Handles HTTP request for retrieving halal items
 */

import { Request, Response, NextFunction } from 'express';
import { findHalalItems } from '../services';


/**
 * Get all halal items
 * @route GET /api/items/halal
 *
 * @example
 * GET /api/items/halal
 * GET /api/items/halal?businessId=uuid
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
