/**
 * Add Item To Option Controller
 * Handles HTTP request for adding a single item to an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Add a single item to an option
 * @route POST /api/item-options/:optionId/items
 * @access Private
 *
 * @example
 * POST /api/item-options/size-options-001/items
 * Body: {
 *   "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *   "maxQuantity": 5,
 *   "active": true
 * }
 */
export const addItemToOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemId, maxQuantity, active } = req.body;

    const result = await ItemOptionService.addItemToOption(
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
