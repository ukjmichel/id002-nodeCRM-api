/**
 * Clear All Items Controller
 * Handles HTTP request for clearing all items from a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Clear all items from a menu
 * @route DELETE /api/menus/:menuId/items
 * @access Private
 *
 * @example
 * DELETE /api/menus/lunch-menu-001/items
 */
export const clearAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const result = await MenuService.clearAllItems(menuId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
