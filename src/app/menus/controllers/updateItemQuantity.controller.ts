/**
 * Update Item Quantity Controller
 * Handles HTTP request for updating an item's quantity in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Update an item's quantity in a menu
 * @route PATCH /api/menus/:menuId/items/:itemId/quantity
 * @access Private
 *
 * @example
 * PATCH /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/quantity
 * Body: {
 *   "quantity": 5
 * }
 */
export const updateItemQuantityController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const { quantity } = req.body;
    const result = await MenuService.updateItemQuantity(menuId, itemId, quantity);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
