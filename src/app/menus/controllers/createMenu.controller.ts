/**
 * Create Menu Controller
 * @route POST /api/menus
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Create a new menu
 * @route POST /api/menus
 * @access Private
 */
export const createMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await MenuService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
