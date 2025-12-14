/**
 * Sync Active Options For Menu Controller
 * @route POST /api/menus/:menuId/active-options/sync
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Synchronize menu's option groups with their current active state
 * @route POST /api/menus/:menuId/active-options/sync
 * @access Private
 *
 * @example
 * POST /api/menus/lunch-menu-001/active-options/sync
 */
export const syncActiveOptionsForMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const result = await MenuService.syncActiveOptions(menuId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
