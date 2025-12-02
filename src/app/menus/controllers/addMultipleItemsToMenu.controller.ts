/**
 * Add Multiple Items To Menu Controller
 * Handles HTTP request for adding multiple items to a menu at once
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add multiple items to a menu at once
 * @route POST /api/menus/:menuId/items/bulk
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002",
 *     "550e8400-e29b-41d4-a716-446655440003"
 *   ],
 *   "defaultQuantity": 1,
 *   "defaultActiveOptions": ["size-option"],
 *   "defaultDefaultItems": []
 * }
 */
export const addMultipleItemsToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const {
      itemIds,
      defaultQuantity,
      defaultActiveOptions,
      defaultDefaultItems,
    } = req.body;

    const result = await MenuService.addMultipleItemsToMenu(
      menuId,
      itemIds,
      defaultQuantity,
      defaultActiveOptions,
      defaultDefaultItems
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
