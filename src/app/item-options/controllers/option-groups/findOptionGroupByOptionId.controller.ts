/**
 * Find Option Group By OptionId Controller
 * Handles HTTP request for retrieving an option group by its optionId
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Get an option group by optionId
 * @route GET /api/option-groups/option/:optionId
 * @access Private
 *
 * @example
 * GET /api/option-groups/option/size-options-001
 */
export const findOptionGroupByOptionIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const result = await OptionGroupService.findByOptionId(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
