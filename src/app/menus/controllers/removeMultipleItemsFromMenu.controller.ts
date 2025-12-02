/**
 * Remove Multiple Items From Menu Controller
 * Handles HTTP request for removing multiple items from a menu at once
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove multiple items from a menu at once
 * @route DELETE /api/menus/:menuId/items/bulk
 * @access Private
 *
 * @example
 * DELETE /api/menus/lunch-menu-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ]
 * }
 */
export const removeMultipleItemsFromMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { itemIds } = req.body;
    const result = await MenuService.removeMultipleItemsFromMenu(menuId, itemIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
