/**
 * Get Groups By Items Controller
 * Handles HTTP request for retrieving option groups containing any of the specified items
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Get all option groups that contain any of the specified items
 * @route POST /api/business-item-option-groups/search/by-items
 * @access Private
 *
 * @example
 * POST /api/business-item-option-groups/search/by-items
 * Body: {
 *   "itemIds": [
 *     "550e8400-e29b-41d4-a716-446655440001",
 *     "550e8400-e29b-41d4-a716-446655440002"
 *   ]
 * }
 */
export const getGroupsByItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemIds } = req.body;
    const result =
      await businessItemOptionGroupService.getGroupsByItems(itemIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
