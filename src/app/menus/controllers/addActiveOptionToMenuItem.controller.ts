/**
 * Add Active Option To Menu Item Controller
 * @route POST /api/menus/:menuId/items/:itemId/active-options
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add an active option to a specific item in a menu
 * @route POST /api/menus/:menuId/items/:itemId/active-options
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/active-options
 * Body: {
 *   "optionId": "size-options"
 * }
 */
export const addActiveOptionToMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const { optionId } = req.body;
    const result = await MenuService.addActiveOptionToItem(menuId, itemId, optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
