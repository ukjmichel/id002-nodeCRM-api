/**
 * Remove Multiple Items From Option Controller
 * Handles HTTP request for removing multiple items from an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Remove multiple items from an option
 * @route DELETE /api/item-options/:optionId/items/bulk
 * @access Private
 *
 * @example
 * DELETE /api/item-options/size-options-001/items/bulk
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ]
 * }
 */
export const removeMultipleItemsFromOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemIds } = req.body;

    const result = await ItemOptionService.removeMultipleItemsFromOption(
      optionId,
      itemIds
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
