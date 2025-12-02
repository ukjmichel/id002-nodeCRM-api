/**
 * Update Menu Name Controller
 * Handles HTTP request for updating a menu's name
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Update a menu's name
 * @route PATCH /api/menus/:menuId/name
 * @access Private
 *
 * @example
 * PATCH /api/menus/lunch-menu-001/name
 * Body: {
 *   "name": "Updated Lunch Menu"
 * }
 */
export const updateMenuNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { name } = req.body;
    const result = await MenuService.updateMenuName(menuId, name);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
