/**
 * Get Options By Items Controller
 * Handles HTTP request for retrieving options containing any of the specified items
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Get all options that contain any of the specified items
 * @route POST /api/item-options/search/by-items
 * @access Private
 *
 * @example
 * POST /api/item-options/search/by-items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ]
 * }
 */
export const getOptionsByItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemIds } = req.body;

    const result = await ItemOptionService.getOptionsByItems(itemIds);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
