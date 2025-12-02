/**
 * Get Active Options Controller
 * Handles HTTP request for getting all active options for an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all active options for an item in a menu
 * @route GET /api/menus/:menuId/items/:itemId/active-options
 * @access Private
 *
 * @example
 * GET /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/active-options
 *
 * Response:
 * {
 *   "success": true,
 *   "data": ["size-option", "topping-option"],
 *   "count": 2,
 *   "message": "Found 2 active option(s)"
 * }
 */
export const getActiveOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const result = await MenuService.getActiveOptions(menuId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
