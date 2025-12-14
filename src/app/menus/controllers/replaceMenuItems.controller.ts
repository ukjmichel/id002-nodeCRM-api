/**
 * Replace Menu Items Controller
 * @route PUT /api/menus/:id/items
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Replace all items in a menu
 * @route PUT /api/menus/:id/items
 * @access Private
 *
 * @example
 * PUT /api/menus/507f1f77bcf86cd799439011/items
 * Body: {
 *   "items": [
 *     { "itemId": "uuid-1", "quantity": 1, "allowOptions": true },
 *     { "itemId": "uuid-2", "quantity": 2, "allowOptions": false }
 *   ]
 * }
 */
export const replaceMenuItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    const result = await MenuService.replaceItems(id, items);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
