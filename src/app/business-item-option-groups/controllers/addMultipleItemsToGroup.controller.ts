/**
 * Add Multiple Items To Group Controller
 * Handles HTTP request for adding multiple items to an option group
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Add multiple items to an option group
 * @route POST /api/business-item-option-groups/:optionId/items/bulk
 * @access Private
 *
 * @example
 * POST /api/business-item-option-groups/size-options-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002",
 *     "550e8400-e29b-41d4-a716-446655440003"
 *   ]
 * }
 */
export const addMultipleItemsToGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds } = req.body;
    const result = await businessItemOptionGroupService.addMultipleItemsToGroup(
      optionId,
      itemIds
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
