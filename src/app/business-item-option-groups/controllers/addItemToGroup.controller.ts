/**
 * Add Item To Group Controller
 * Handles HTTP request for adding a single item to an option group
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Add a single item to an option group
 * @route POST /api/business-item-option-groups/:optionId/items
 * @access Private
 *
 * @example
 * POST /api/business-item-option-groups/size-options-001/items
 * Body: {
 *   "itemId": "550e8400-e29b-41d4-a716-446655440001"
 * }
 */
export const addItemToGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { itemId } = req.body;
    const result = await businessItemOptionGroupService.addItemToGroup(
      optionId,
      itemId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
