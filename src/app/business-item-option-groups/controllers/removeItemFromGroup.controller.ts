/**
 * Remove Item From Group Controller
 * Handles HTTP request for removing a single item from an option group
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Remove a single item from an option group
 * @route DELETE /api/business-item-option-groups/:optionId/items/:itemId
 * @access Private
 *
 * @example
 * DELETE /api/business-item-option-groups/size-options-001/items/550e8400-e29b-41d4-a716-446655440001
 */
export const removeItemFromGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;
    const result = await businessItemOptionGroupService.removeItemFromGroup(
      optionId,
      itemId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
