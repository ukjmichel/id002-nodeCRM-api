/**
 * Find Items By Type Controller
 * Handles HTTP request for retrieving items by type
 */

import { Request, Response, NextFunction } from 'express';
import { findItemsByType } from '../services/findItemsByType.js';
import { ItemType } from '../models/business-item.model.js';

/**
 * Get all items with a specific type
 * @route GET /api/business-items/type/:type
 *
 * @example
 * GET /api/business-items/type/food
 * GET /api/business-items/type/drink?businessId=uuid
 */
export const findItemsByTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;
    const { businessId } = req.query;

    const result = await findItemsByType(
      type as ItemType,
      businessId as string | undefined
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
