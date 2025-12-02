/**
 * Set Default Items Controller
 * Handles HTTP request for setting all default items for an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Set all default items for an item in a menu (replaces existing)
 * @route PUT /api/menus/:menuId/items/:itemId/default-items
 * @access Private
 *
 * @example
 * PUT /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/default-items
 * Body: {
 *   "defaultItemIds": [
 *     "550e8400-e29b-41d4-a716-446655440098",
 *     "550e8400-e29b-41d4-a716-446655440099"
 *   ]
 * }
 */
export const setDefaultItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const { defaultItemIds } = req.body;
    const result = await MenuService.setDefaultItems(menuId, itemId, defaultItemIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
