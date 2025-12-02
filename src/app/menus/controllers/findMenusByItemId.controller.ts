/**
 * Find Menus By Item ID Controller
 * Handles HTTP request for fetching menus containing a specific item
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Find all menus containing a specific item
 * @route GET /api/menus/by-item/:itemId
 * @access Private
 *
 * @example
 * GET /api/menus/by-item/550e8400-e29b-41d4-a716-446655440001
 */
export const findMenusByItemIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await MenuService.findByItemId(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
