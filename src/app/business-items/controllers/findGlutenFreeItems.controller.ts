/**
 * Find Gluten-Free Items Controller
 * Handles HTTP request for retrieving gluten-free items
 */

import { Request, Response, NextFunction } from 'express';
import { findGlutenFreeItems } from '../services/findGlutenFreeItems.js';

/**
 * Get all gluten-free items
 * @route GET /api/business-items/gluten-free
 *
 * @example
 * GET /api/business-items/gluten-free
 * GET /api/business-items/gluten-free?businessId=uuid
 */
export const findGlutenFreeItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findGlutenFreeItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
