/**
 * Get Menu Item Controller
 * @route GET /api/menus/:id/items/:itemId
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get a specific item from a menu
 * @route GET /api/menus/:id/items/:itemId
 * @access Private
 */
export const getMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, itemId } = req.params;
    const result = await MenuService.getItem(id, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
