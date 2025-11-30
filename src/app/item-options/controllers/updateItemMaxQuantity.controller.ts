/**
 * Update Item Max Quantity Controller
 * Handles HTTP request for updating the max quantity of an item in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Update the max quantity of an item in an option
 * @route PATCH /api/item-options/:optionId/items/:itemId/max-quantity
 * @access Private
 *
 * @example
 * PATCH /api/item-options/size-options-001/items/550e8400-e29b-41d4-a716-446655440001/max-quantity
 * Body: {
 *   "maxQuantity": 10
 * }
 */
export const updateItemMaxQuantityController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;
    const { maxQuantity } = req.body;

    const result = await ItemOptionService.updateItemMaxQuantity(
      optionId,
      itemId,
      maxQuantity
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
