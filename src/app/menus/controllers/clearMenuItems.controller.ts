/**
 * Clear Menu Items Controller
 * @route DELETE /api/menus/:id/items
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove all items from a menu
 * @route DELETE /api/menus/:id/items
 * @access Private
 */
export const clearMenuItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.clearItems(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
