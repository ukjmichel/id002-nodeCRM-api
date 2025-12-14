/**
 * Create Option Group Controller
 * Handles HTTP request for creating a new option group
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';


/**
 * Create a new option group
 * @route POST /api/option-groups
 * @access Private
 *
 * @example
 * POST /api/option-groups
 * Body: {
 *   "optionId": "size-options-001",
 *   "description": "Size options for beverages",
 *   "items": []
 * }
 */
export const createOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OptionGroupService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
