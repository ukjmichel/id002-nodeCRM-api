/**
 * Get Items With Options Controller
 * @route GET /api/menus/:id/items/with-options
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all items that allow options from a menu
 * @route GET /api/menus/:id/items/with-options
 * @access Private
 */
export const getItemsWithOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.getItemsWithOptions(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
