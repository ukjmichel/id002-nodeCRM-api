/**
 * Get Item Details Controller
 * Handles HTTP request for retrieving details of a specific item in an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Get details of a specific item in an option group
 * @route GET /api/option-groups/:optionId/items/:itemId
 * @access Private
 *
 * @example
 * GET /api/option-groups/size-options-001/items/550e8400-e29b-41d4-a716-446655440001
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *     "maxQuantity": 5,
 *     "active": true
 *   },
 *   "message": "Item details retrieved successfully"
 * }
 */
export const getItemDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId, itemId } = req.params;
    const result = await OptionGroupService.getItemDetails(optionId, itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
