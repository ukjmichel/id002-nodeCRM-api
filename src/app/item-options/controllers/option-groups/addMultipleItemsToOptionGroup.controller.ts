/**
 * Add Multiple Items To Option Group Controller
 * Handles HTTP request for adding multiple items to an option group at once
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Add multiple items to an option group at once
 * @route POST /api/option-groups/:optionId/items/bulk
 * @access Private
 *
 * @example
 * POST /api/option-groups/size-options-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ],
 *   "defaultMaxQuantity": 5,
 *   "defaultActive": true
 * }
 */
export const addMultipleItemsToOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds, defaultMaxQuantity, defaultActive } = req.body;
    const result = await OptionGroupService.addMultipleItemsToOptionGroup(
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
