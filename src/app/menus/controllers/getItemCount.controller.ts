/**
 * Get Item Count Controller
 * Handles HTTP request for getting the number of items in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get the number of items in a menu
 * @route GET /api/menus/:menuId/items/count
 * @access Private
 *
 * @example
 * GET /api/menus/lunch-menu-001/items/count
 *
 * Response:
 * {
 *   "success": true,
 *   "data": 5,
 *   "count": 5,
 *   "message": "Menu contains 5 item(s)"
 * }
 */
export const getItemCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const result = await MenuService.getItemCount(menuId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
