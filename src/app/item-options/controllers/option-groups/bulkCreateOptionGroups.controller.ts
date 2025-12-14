/**
 * Bulk Create Option Groups Controller
 * Handles HTTP request for creating multiple option groups at once
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';

/**
 * Create multiple option groups at once
 * @route POST /api/option-groups/bulk
 * @access Private
 *
 * @example
 * POST /api/option-groups/bulk
 * Body: [
 *   {
 *     "optionId": "size-options-001",
 *     "description": "Size options for beverages",
 *     "items": []
 *   },
 *   {
 *     "optionId": "topping-options-001",
 *     "description": "Topping options for pizzas",
 *     "items": []
 *   }
 * ]
 */
export const bulkCreateOptionGroupsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OptionGroupService.bulkCreate(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
