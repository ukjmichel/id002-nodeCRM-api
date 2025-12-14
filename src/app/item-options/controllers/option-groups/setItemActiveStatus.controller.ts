/**
 * Set Item Active Status Controller
 * Handles HTTP request for setting an item's active status in an option group
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';

/**
 * Set an item's active status in an option group
 * @route PATCH /api/option-groups/:optionId/items/:itemId/active
 * @access Private
 *
 * @example
 * PATCH /api/option-groups/size-options-001/items/550e8400-e29b-41d4-a716-446655440001/active
 * Body: {
 *   "active": false
 * }
 */
export const setItemActiveStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;
    const { active } = req.body;
    const result = await OptionGroupService.setItemActiveStatus(
      optionId,
      itemId,
      active
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
