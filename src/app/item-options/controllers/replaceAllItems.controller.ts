/**
 * Replace All Items Controller
 * Handles HTTP request for replacing all items in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Replace all items in an option with new items
 * @route PUT /api/item-options/:optionId/items
 * @access Private
 *
 * @example
 * PUT /api/item-options/size-options-001/items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002",
 *     "550e8400-e29b-41d4-a716-446655440003"
 *   ],
 *   "defaultMaxQuantity": 5,
 *   "defaultActive": true
 * }
 */
export const replaceAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds, defaultMaxQuantity, defaultActive } = req.body;

    const result = await ItemOptionService.replaceAllItems(
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
