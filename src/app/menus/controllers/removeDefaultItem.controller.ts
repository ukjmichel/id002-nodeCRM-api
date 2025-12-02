/**
 * Remove Default Item Controller
 * Handles HTTP request for removing a default item from an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove a default item from an item in a menu
 * @route DELETE /api/menus/:menuId/items/:itemId/default-items/:defaultItemId
 * @access Private
 *
 * @example
 * DELETE /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/default-items/550e8400-e29b-41d4-a716-446655440099
 */
export const removeDefaultItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId, defaultItemId } = req.params;
    const result = await MenuService.removeDefaultItem(menuId, itemId, defaultItemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
