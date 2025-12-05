/**
 * Replace All Items Controller
 * Handles HTTP request for replacing all items in an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Replace all items in an option group with a new set
 * @route PUT /api/option-groups/:optionId/items
 * @access Private
 *
 * @example
 * PUT /api/option-groups/size-options-001/items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
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
    const result = await OptionGroupService.replaceAllItems(
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
