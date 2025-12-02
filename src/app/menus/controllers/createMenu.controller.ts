/**
 * Create Menu Controller
 * Handles HTTP request for creating a new menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Create a new menu
 * @route POST /api/menus
 * @access Private
 *
 * @example
 * POST /api/menus
 * Body: {
 *   "menuId": "lunch-menu-001",
 *   "name": "Lunch Menu",
 *   "description": "Daily lunch specials",
 *   "items": []
 * }
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
