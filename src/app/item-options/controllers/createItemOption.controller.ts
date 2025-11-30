/**
 * Create Business Item Option Group Controller
 * Handles HTTP request for creating a new option group
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Create a new business item option group
 * @route POST /api/business-item-option-groups
 * @access Private
 *
 * @example
 * POST /api/business-item-option-groups
 * Body: {
 *   "optionId": "size-options-001",
 *   "description": "Size options for beverages",
 *   "items": []
 * }
 */
export const createItemOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ItemOptionService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
