/**
 * Find Business Item Option Group By OptionId Controller
 * Handles HTTP request for retrieving an option group by its optionId
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Get a business item option group by optionId
 * @route GET /api/business-item-option-groups/option/:optionId
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/option/size-options-001
 */
export const findItemOptionByOptionIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const result = await ItemOptionService.findByOptionId(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
