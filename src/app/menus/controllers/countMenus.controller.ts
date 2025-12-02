/**
 * Count Menus Controller
 * Handles HTTP request for counting menus
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Count menus with optional filtering
 * @route GET /api/menus/count
 * @access Private
 *
 * @example
 * GET /api/menus/count
 * GET /api/menus/count?filter={"name":{"$regex":"lunch"}}
 */
export const countMenusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};
    const result = await MenuService.count(filter);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
