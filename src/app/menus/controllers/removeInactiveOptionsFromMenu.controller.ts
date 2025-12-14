/**
 * Remove Inactive Options From Menu Controller
 * @route DELETE /api/menus/:menuId/inactive-options
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove all option groups from a menu that have no active items
 * @route DELETE /api/menus/:menuId/inactive-options
 * @access Private
 *
 * @example
 * DELETE /api/menus/lunch-menu-001/inactive-options
 */
export const removeInactiveOptionsFromMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const result = await MenuService.removeInactiveOptions(menuId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
