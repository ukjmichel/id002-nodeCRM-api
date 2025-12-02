/**
 * Remove Item From Menu Controller
 * Handles HTTP request for removing a single item from a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove a single item from a menu
 * @route DELETE /api/menus/:menuId/items/:itemId
 * @access Private
 *
 * @example
 * DELETE /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001
 */
export const removeItemFromMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const result = await MenuService.removeItemFromMenu(menuId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
