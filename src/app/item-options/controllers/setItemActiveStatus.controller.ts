/**
 * Set Item Active Status Controller
 * Handles HTTP request for setting the active status of an item in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Set the active status of an item in an option
 * @route PATCH /api/item-options/:optionId/items/:itemId/active
 * @access Private
 *
 * @example
 * PATCH /api/item-options/size-options-001/items/550e8400-e29b-41d4-a716-446655440001/active
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

    const result = await ItemOptionService.setItemActiveStatus(
      optionId,
      itemId,
      active
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
