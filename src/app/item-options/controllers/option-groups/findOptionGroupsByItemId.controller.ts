/**
 * Find Option Groups By ItemId Controller
 * Handles HTTP request for retrieving option groups containing a specific item
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Get all option groups containing a specific item
 * @route GET /api/option-groups/item/:itemId
 * @access Private
 *
 * @example
 * GET /api/option-groups/item/550e8400-e29b-41d4-a716-446655440001
 */
export const findOptionGroupsByItemIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await OptionGroupService.findByItemId(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
