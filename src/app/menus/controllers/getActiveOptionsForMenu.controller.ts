/**
 * Get Active Options For Menu Controller
 * @route GET /api/menus/:menuId/active-options
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get all active option groups linked to a menu
 * @route GET /api/menus/:menuId/active-options
 * @access Private
 *
 * @example
 * GET /api/menus/lunch-menu-001/active-options
 * GET /api/menus/lunch-menu-001/active-options?includeInactiveItems=true
 */
export const getActiveOptionsForMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId } = req.params;
    const includeInactiveItems = req.query.includeInactiveItems === 'true';
    const result = await MenuService.getActiveOptions(menuId, includeInactiveItems);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
