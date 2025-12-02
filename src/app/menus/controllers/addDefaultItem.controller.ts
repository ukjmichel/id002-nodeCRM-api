/**
 * Add Default Item Controller
 * Handles HTTP request for adding a default item to an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add a default item to an item in a menu
 * @route POST /api/menus/:menuId/items/:itemId/default-items
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/default-items
 * Body: {
 *   "defaultItemId": "550e8400-e29b-41d4-a716-446655440099"
 * }
 */
export const addDefaultItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const { defaultItemId } = req.body;
    const result = await MenuService.addDefaultItem(menuId, itemId, defaultItemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
