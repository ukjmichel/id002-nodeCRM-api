/**
 * Remove Active Option Controller
 * Handles HTTP request for removing an active option from an item in a menu
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Remove an active option from an item in a menu
 * @route DELETE /api/menus/:menuId/items/:itemId/active-options/:optionId
 * @access Private
 *
 * @example
 * DELETE /api/menus/lunch-menu-001/items/550e8400-e29b-41d4-a716-446655440001/active-options/size-option
 */
export const removeActiveOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuId, itemId, optionId } = req.params;
    const result = await MenuService.removeActiveOption(menuId, itemId, optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
