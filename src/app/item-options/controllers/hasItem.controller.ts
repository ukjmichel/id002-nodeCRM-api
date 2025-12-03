/**
 * Has Item Controller
 * Handles HTTP request for checking if an option group contains a specific item
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Check if an option group contains a specific item
 * @route GET /api/business-item-option-groups/:optionId/items/:itemId/exists
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/size-options-001/items/550e8400-e29b-41d4-a716-446655440001/exists
 */
export const hasItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;
    const result = await ItemOptionService.hasItem(optionId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
