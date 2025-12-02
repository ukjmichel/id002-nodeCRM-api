/**
 * Find Menu By MenuId Controller
 * Handles HTTP request for fetching a menu by its menuId
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Find a menu by its menuId
 * @route GET /api/menus/by-menu-id/:menuId
 * @access Private
 *
 * @example
 * GET /api/menus/by-menu-id/lunch-menu-001
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
