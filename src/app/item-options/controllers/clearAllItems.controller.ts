/**
 * Clear All Items Controller
 * Handles HTTP request for clearing all items from an option group
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Clear all items from an option group
 * @route DELETE /api/business-item-option-groups/:optionId/items
 * @access Private
 *
 * @example
 * DELETE /api/business-item-option-groups/size-options-001/items
 */
export const clearAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const result = await ItemOptionService.clearAllItems(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
