/**
 * Update Menu Description Controller
 * Handles HTTP request for updating a menu's description
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Update a menu's description
 * @route PATCH /api/menus/:menuId/description
 * @access Private
 *
 * @example
 * PATCH /api/menus/lunch-menu-001/description
 * Body: {
 *   "description": "Updated lunch menu with seasonal specials"
 * }
 */
export const updateMenuDescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { description } = req.body;
    const result = await MenuService.updateMenuDescription(menuId, description);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
