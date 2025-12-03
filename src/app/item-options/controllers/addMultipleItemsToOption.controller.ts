/**
 * Add Multiple Items To Option Controller
 * Handles HTTP request for adding multiple items to an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Add multiple items to an option
 * @route POST /api/item-options/:optionId/items/bulk
 * @access Private
 *
 * @example
 * POST /api/item-options/size-options-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002",
 *     "550e8400-e29b-41d4-a716-446655440003"
 *   ],
 *   "defaultMaxQuantity": 3,
 *   "defaultActive": true
 * }
 */
export const addMultipleItemsToOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds, defaultMaxQuantity, defaultActive } = req.body;

    const result = await ItemOptionService.addMultipleItemsToOption(
      optionId,
      itemIds,
      defaultMaxQuantity,
      defaultActive
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
