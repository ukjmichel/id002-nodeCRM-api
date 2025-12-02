/**
 * Set Active Options Controller
 * Handles HTTP request for setting all active options for an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Set all active options for an item in a menu (replaces existing)
 * @route PUT /api/menus/:menuId/items/:itemId/active-options
 * @access Private
 *
 * @example
 * PUT /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/active-options
 * Body: {
 *   "optionIds": ["size-option", "topping-option", "sauce-option"]
 * }
 */
export const setActiveOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId } = req.params;
    const { optionIds } = req.body;
    const result = await MenuService.setActiveOptions(menuId, itemId, optionIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
