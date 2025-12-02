/**
 * Bulk Create Menus Controller
 * Handles HTTP request for creating multiple menus at once
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Create multiple menus at once
 * @route POST /api/menus/bulk
 * @access Private
 *
 * @example
 * POST /api/menus/bulk
 * Body: {
 *   "menus": [
 *     {
 *       "menuId": "lunch-menu-001",
 *       "name": "Lunch Menu",
 *       "description": "Daily lunch specials",
 *       "items": []
 *     },
 *     {
 *       "menuId": "dinner-menu-001",
 *       "name": "Dinner Menu",
 *       "description": "Evening dinner options",
 *       "items": []
 *     }
 *   ]
 * }
 */
export const bulkCreateMenusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menus } = req.body;
    const result = await MenuService.bulkCreate(menus);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
