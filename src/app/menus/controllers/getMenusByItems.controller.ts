/**
 * Get Menus By Items Controller
 * Handles HTTP request for fetching menus containing any of the specified items
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all menus that contain any of the specified items
 * @route POST /api/menus/by-items
 * @access Private
 *
 * @example
 * POST /api/menus/by-items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ]
 * }
 */
export const getMenusByItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemIds } = req.body;
    const result = await MenuService.getMenusByItems(itemIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
