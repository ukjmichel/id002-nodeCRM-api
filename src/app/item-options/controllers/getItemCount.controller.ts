/**
 * Get Item Count Controller
 * Handles HTTP request for getting the item count of an option group
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Get the number of items in an option group
 * @route GET /api/business-item-option-groups/:optionId/items/count
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/size-options-001/items/count
 */
export const getItemCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const result = await ItemOptionService.getItemCount(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
