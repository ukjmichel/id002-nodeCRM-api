/**
 * Find Menu By MenuId Controller
 * @route GET /api/menus/by-menu-id/:menuId
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get a menu by custom menuId
 * @route GET /api/menus/by-menu-id/:menuId
 * @access Private
 */
export const findMenuByMenuIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const result = await MenuService.findByMenuId(menuId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
