/**
 * Replace All Items Controller
 * Handles HTTP request for replacing all items in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Replace all items in a menu with new items
 * @route PUT /api/menus/:menuId/items
 * @access Private
 *
 * @example
 * PUT /api/menus/lunch-menu-001/items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ],
 *   "defaultQuantity": 1,
 *   "defaultActiveOptions": [],
 *   "defaultDefaultItems": []
 * }
 */
export const replaceAllItemsController = async (
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

    const result = await MenuService.replaceAllItems(
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
