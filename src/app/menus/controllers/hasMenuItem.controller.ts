/**
 * Has Menu Item Controller
 * @route GET /api/menus/:id/items/:itemId/exists
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Check if a menu contains a specific item
 * @route GET /api/menus/:id/items/:itemId/exists
 * @access Private
 */
export const hasMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, itemId } = req.params;
    const result = await MenuService.hasItem(id, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
