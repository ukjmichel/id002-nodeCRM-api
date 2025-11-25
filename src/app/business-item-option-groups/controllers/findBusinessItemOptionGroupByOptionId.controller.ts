/**
 * Find Business Item Option Group By OptionId Controller
 * Handles HTTP request for retrieving an option group by its optionId
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Get a business item option group by optionId
 * @route GET /api/business-item-option-groups/option/:optionId
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/option/size-options-001
 */
export const findBusinessItemOptionGroupByOptionIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const result = await businessItemOptionGroupService.findByOptionId(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
