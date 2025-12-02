/**
 * Add Item To Menu Controller
 * Handles HTTP request for adding a single item to a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add a single item to a menu
 * @route POST /api/menus/:menuId/items
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/items
 * Body: {
 *   "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *   "quantity": 2,
 *   "activeOptions": ["size-option", "topping-option"],
 *   "defaultItems": ["550e8400-e29b-41d4-a716-446655440099"]
 * }
 */
export const addItemToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { itemId, quantity, activeOptions, defaultItems } = req.body;

    const result = await MenuService.addItemToMenu(
      menuId,
      itemId,
      quantity,
      activeOptions,
      defaultItems
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
