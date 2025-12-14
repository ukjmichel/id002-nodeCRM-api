/**
 * Bulk Add Items To Menu Controller
 * @route POST /api/menus/:id/items/bulk
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add multiple items to a menu at once
 * @route POST /api/menus/:id/items/bulk
 * @access Private
 *
 * @example
 * POST /api/menus/507f1f77bcf86cd799439011/items/bulk
 * Body: {
 *   "items": [
 *     { "itemId": "uuid-1", "quantity": 1, "allowOptions": true },
 *     { "itemId": "uuid-2", "quantity": 2, "allowOptions": false }
 *   ]
 * }
 */
export const bulkAddItemsToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.bulkAddItems(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
