/**
 * Get Menu Item Count Controller
 * @route GET /api/menus/:id/items/count
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get the number of items in a menu
 * @route GET /api/menus/:id/items/count
 * @access Private
 */
export const getMenuItemCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.getItemCount(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
