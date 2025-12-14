/**
 * Remove Item From Menu Controller
 * @route DELETE /api/menus/:id/items/:itemId
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove an item from a menu
 * @route DELETE /api/menus/:id/items/:itemId
 * @access Private
 */
export const removeItemFromMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, itemId } = req.params;
    const result = await MenuService.removeItem(id, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
