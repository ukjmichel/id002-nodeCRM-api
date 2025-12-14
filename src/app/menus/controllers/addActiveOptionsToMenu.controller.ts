/**
 * Add Active Options To Menu Controller
 * @route POST /api/menus/:menuId/active-options/bulk
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add multiple active option groups to a menu (only those with active items)
 * @route POST /api/menus/:menuId/active-options/bulk
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/active-options/bulk
 * Body: {
 *   "optionIds": ["size-options", "topping-options", "sauce-options"],
 *   "required": false
 * }
 */
export const addActiveOptionsToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { optionIds, required } = req.body;
    const result = await MenuService.addActiveOptions(menuId, optionIds, required);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
