/**
 * Get Default Items Controller
 * Handles HTTP request for getting all default items for an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all default items for an item in a menu
 * @route GET /api/menus/:menuId/items/:itemId/default-items
 * @access Private
 *
 * @example
 * GET /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/default-items
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     "550e8400-e29b-41d4-a716-446655440098",
 *     "550e8400-e29b-41d4-a716-446655440099"
 *   ],
 *   "count": 2,
 *   "message": "Found 2 default item(s)"
 * }
 */
export const getDefaultItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const result = await MenuService.getDefaultItems(menuId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
