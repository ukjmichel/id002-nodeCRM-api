/**
 * Has Item Controller
 * Handles HTTP request for checking if a menu contains a specific item
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Check if a menu contains a specific item
 * @route GET /api/menus/:menuId/items/:itemId/exists
 * @access Private
 *
 * @example
 * GET /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/exists
 *
 * Response:
 * {
 *   "success": true,
 *   "data": true,
 *   "message": "Item exists in menu"
 * }
 */
export const hasItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const result = await MenuService.hasItem(menuId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
