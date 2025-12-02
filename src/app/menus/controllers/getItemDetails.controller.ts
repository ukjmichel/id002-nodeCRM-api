/**
 * Get Item Details Controller
 * Handles HTTP request for getting details of a specific item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get details of a specific item in a menu
 * @route GET /api/menus/:menuId/items/:itemId
 * @access Private
 *
 * @example
 * GET /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *     "quantity": 2,
 *     "activeOptions": ["size-option"],
 *     "defaultItems": ["550e8400-e29b-41d4-a716-446655440099"]
 *   },
 *   "message": "Item details retrieved successfully"
 * }
 */
export const getItemDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const result = await MenuService.getItemDetails(menuId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
