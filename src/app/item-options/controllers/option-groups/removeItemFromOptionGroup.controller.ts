/**
 * Remove Item From Option Group Controller
 * Handles HTTP request for removing a single item from an option group
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';

/**
 * Remove a single item from an option group
 * @route DELETE /api/option-groups/:optionId/items/:itemId
 * @access Private
 *
 * @example
 * DELETE /api/option-groups/size-options-001/items/550e8400-e29b-41d4-a716-446655440001
 */
export const removeItemFromOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;
    const result = await OptionGroupService.removeItem(
      optionId,
      itemId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
