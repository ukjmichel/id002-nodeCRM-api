/**
 * Bulk Update Items Controller
 * Handles HTTP request for bulk updating items in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Bulk update items in a menu
 * @route PATCH /api/menus/:menuId/items/bulk
 * @access Private
 *
 * @example
 * PATCH /api/menus/lunch-menu-001/items/bulk
 * Body: {
 *   "updates": [
 *     { "itemId": "550e8400-e29b-41d4-a716-446655440001", "quantity": 5 },
 *     { "itemId": "550e8400-e29b-41d4-a716-446655440002", "activeOptions": ["size-option"] },
 *     { "itemId": "550e8400-e29b-41d4-a716-446655440003", "quantity": 10, "defaultItems": ["default-1"] }
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { ... },
 *   "message": "3 item(s) updated successfully"
 * }
 */
export const bulkUpdateItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { updates } = req.body;

    const result = await MenuService.bulkUpdateItems(menuId, updates);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
