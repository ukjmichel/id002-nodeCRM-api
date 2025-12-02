/**
 * Find Menus By Name Controller
 * Handles HTTP request for fetching menus by name (partial match)
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Find menus by name (partial match, case-insensitive)
 * @route GET /api/menus/by-name/:name
 * @access Private
 *
 * @example
 * GET /api/menus/by-name/lunch
 * GET /api/menus/by-name/breakfast
 */
export const findMenusByNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.params;
    const result = await MenuService.findByName(name);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
