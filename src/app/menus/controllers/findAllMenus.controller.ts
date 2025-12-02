/**
 * Find All Menus Controller
 * Handles HTTP request for fetching all menus
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Find all menus with optional filtering and pagination
 * @route GET /api/menus
 * @access Private
 *
 * @example
 * GET /api/menus
 * GET /api/menus?page=1&limit=10
 * GET /api/menus?filter={"name":{"$regex":"lunch","$options":"i"}}
 * GET /api/menus?sort={"name":1}
 */
export const findAllMenusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};
    const options = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : undefined,
      sort: req.query.sort ? JSON.parse(req.query.sort as string) : undefined,
    };

    const result = await MenuService.findAll(filter, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
