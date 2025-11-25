/**
 * Bulk Create Business Item Option Groups Controller
 * Handles HTTP request for creating multiple option groups at once
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Create multiple business item option groups
 * @route POST /api/business-item-option-groups/bulk
 * @access Private
 *
 * @example
 * POST /api/business-item-option-groups/bulk
 * Body: [
 *   {
 *     "optionId": "size-options-001",
 *     "description": "Size options",
 *     "items": []
 *   },
 *   {
 *     "optionId": "flavor-options-001",
 *     "description": "Flavor options",
 *     "items": []
 *   }
 * ]
 */
export const bulkCreateBusinessItemOptionGroupsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await businessItemOptionGroupService.bulkCreate(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
