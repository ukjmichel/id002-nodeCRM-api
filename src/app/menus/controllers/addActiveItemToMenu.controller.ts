/**
 * Add Active Item To Menu Controller
 * @route POST /api/menus/:menuId/active-items
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add an active item to a menu (only if item is active in the option group)
 * @route POST /api/menus/:menuId/active-items
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/active-items
 * Body: {
 *   "optionId": "size-options",
 *   "itemId": "550e8400-e29b-41d4-a716-446655440001"
 * }
 */
export const addActiveItemToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { optionId, itemId } = req.body;
    const result = await MenuService.addActiveItem(menuId, optionId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
