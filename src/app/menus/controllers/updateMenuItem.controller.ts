/**
 * Update Menu Item Controller
 * @route PUT /api/menus/:id/items/:itemId
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Update an item in a menu
 * @route PUT /api/menus/:id/items/:itemId
 * @access Private
 *
 * @example
 * PUT /api/menus/507f1f77bcf86cd799439011/items/550e8400-e29b-41d4-a716-446655440001
 * Body: {
 *   "quantity": 5,
 *   "allowOptions": false
 * }
 */
export const updateMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, itemId } = req.params;
    const result = await MenuService.updateItem(id, itemId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
