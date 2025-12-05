/**
 * Update Item Max Quantity Controller
 * Handles HTTP request for updating an item's max quantity in an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Update an item's max quantity in an option group
 * @route PATCH /api/option-groups/:optionId/items/:itemId/max-quantity
 * @access Private
 *
 * @example
 * PATCH /api/option-groups/size-options-001/items/550e8400-e29b-41d4-a716-446655440001/max-quantity
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
    const result = await OptionGroupService.updateItemMaxQuantity(
      optionId,
      itemId,
      maxQuantity
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
