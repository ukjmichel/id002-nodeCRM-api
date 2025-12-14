/**
 * Find All Menus Controller
 * @route GET /api/menus
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all menus with optional filtering and pagination
 * @route GET /api/menus
 * @access Private
 *
 * @example
 * GET /api/menus
 * GET /api/menus?limit=10&skip=0&sort=createdAt&order=desc
 */
export const findAllMenusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit, skip, sort, order } = req.query;
    
    const options: any = {};
    if (limit) options.limit = parseInt(limit as string, 10);
    if (skip) options.skip = parseInt(skip as string, 10);
    if (sort) options.sort = { [sort as string]: order === 'asc' ? 1 : -1 };
    
    const result = await MenuService.findAll(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
