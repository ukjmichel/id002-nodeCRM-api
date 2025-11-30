/**
 * Find Business Item Option Groups By ItemId Controller
 * Handles HTTP request for retrieving option groups containing a specific item
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Get all option groups containing a specific item
 * @route GET /api/business-item-option-groups/item/:itemId
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/item/550e8400-e29b-41d4-a716-446655440001
 */
export const findItemOptionsByItemIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await ItemOptionService.findByItemId(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
