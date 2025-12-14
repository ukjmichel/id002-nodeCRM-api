/**
 * Find Menus By Item ID Controller
 * @route GET /api/menus/search/by-item/:itemId
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Find all menus containing a specific item
 * @route GET /api/menus/search/by-item/:itemId
 * @access Private
 */
export const findMenusByItemIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await MenuService.findByItemId(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
