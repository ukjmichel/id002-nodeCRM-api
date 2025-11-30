/**
 * Get Active Items Controller
 * Handles HTTP request for retrieving all active items from an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Get all active items from an option
 * @route GET /api/item-options/:optionId/items/active
 * @access Private
 *
 * @example
 * GET /api/item-options/size-options-001/items/active
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "itemId": "550e8400-...", "maxQuantity": 1, "active": true },
 *     { "itemId": "550e8400-...", "maxQuantity": 5, "active": true }
 *   ],
 *   "count": 2,
 *   "message": "Found 2 active item(s)"
 * }
 */
export const getActiveItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;

    const result = await ItemOptionService.getActiveItems(optionId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
