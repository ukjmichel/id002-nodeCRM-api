/**
 * Add Item To Option Group Controller
 * Handles HTTP request for adding a single item to an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Add a single item to an option group
 * @route POST /api/option-groups/:optionId/items
 * @access Private
 *
 * @example
 * POST /api/option-groups/size-options-001/items
 * Body: {
 *   "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *   "maxQuantity": 5,
 *   "active": true
 * }
 */
export const addItemToOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemId, maxQuantity, active } = req.body;
    const result = await OptionGroupService.addItemToOptionGroup(
      optionId,
      itemId,
      maxQuantity,
      active
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
