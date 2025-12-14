/**
 * Remove Multiple Items From Option Group Controller
 * Handles HTTP request for removing multiple items from an option group at once
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';

/**
 * Remove multiple items from an option group at once
 * @route DELETE /api/option-groups/:optionId/items/bulk
 * @access Private
 *
 * @example
 * DELETE /api/option-groups/size-options-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ]
 * }
 */
export const removeMultipleItemsFromOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds } = req.body;
    const result = await OptionGroupService.removeMultipleItems(
      optionId,
      itemIds
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
