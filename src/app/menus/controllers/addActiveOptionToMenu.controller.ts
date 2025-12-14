/**
 * Add Active Option To Menu Controller
 * @route POST /api/menus/:menuId/active-options
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Add an active option group to a menu (only if option group has active items)
 * @route POST /api/menus/:menuId/active-options
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/active-options
 * Body: {
 *   "optionId": "size-options"
 * }
 */
export const addActiveOptionToMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const { optionId } = req.body;
    const result = await MenuService.addActiveOption(menuId, optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
