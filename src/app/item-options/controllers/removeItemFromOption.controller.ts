/**
 * Remove Item From Option Controller
 * Handles HTTP request for removing a single item from an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Remove a single item from an option
 * @route DELETE /api/item-options/:optionId/items/:itemId
 * @access Private
 *
 * @example
 * DELETE /api/item-options/size-options-001/items/550e8400-e29b-41d4-a716-446655440001
 */
export const removeItemFromOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;

    const result = await ItemOptionService.removeItemFromOption(
      optionId,
      itemId
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
