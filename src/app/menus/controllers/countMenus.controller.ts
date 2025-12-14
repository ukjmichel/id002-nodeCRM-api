/**
 * Count Menus Controller
 * @route GET /api/menus/count
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Count all menus
 * @route GET /api/menus/count
 * @access Private
 */
export const countMenusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await MenuService.count();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
