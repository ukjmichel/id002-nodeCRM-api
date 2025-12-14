/**
 * Get Items Without Options Controller
 * @route GET /api/menus/:id/items/without-options
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all items that don't allow options from a menu
 * @route GET /api/menus/:id/items/without-options
 * @access Private
 */
export const getItemsWithoutOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.getItemsWithoutOptions(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
