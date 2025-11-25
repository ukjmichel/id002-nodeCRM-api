/**
 * Replace All Items Controller
 * Handles HTTP request for replacing all items in an option group
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Replace all items in an option group with new items
 * @route PUT /api/business-item-option-groups/:optionId/items
 * @access Private
 *
 * @example
 * PUT /api/business-item-option-groups/size-options-001/items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002",
 *     "550e8400-e29b-41d4-a716-446655440003"
 *   ]
 * }
 */
export const replaceAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds } = req.body;
    const result = await businessItemOptionGroupService.replaceAllItems(
      optionId,
      itemIds
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
