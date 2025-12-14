/**
 * Add Item To Menu Controller
 * @route POST /api/menus/:id/items
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add an item to a menu
 * @route POST /api/menus/:id/items
 * @access Private
 *
 * @example
 * POST /api/menus/507f1f77bcf86cd799439011/items
 * Body: {
 *   "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *   "quantity": 1,
 *   "allowOptions": true
 * }
 */
export const addItemToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.addItem(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
