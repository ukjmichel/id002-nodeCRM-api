/**
 * Find Available Items Controller
 * Handles HTTP request for retrieving available items
 */

import { Request, Response, NextFunction } from 'express';
import { findAvailableItems } from '../services/findAvailableItems.js';

/**
 * Get all available items
 * @route GET /api/business-items/available
 *
 * @example
 * GET /api/business-items/available
 * GET /api/business-items/available?businessId=uuid
 */
export const findAvailableItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findAvailableItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
