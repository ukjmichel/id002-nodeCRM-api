/**
 * Get Item Details Controller
 * Handles HTTP request for retrieving details of a specific item in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Get details of a specific item in an option
 * @route GET /api/item-options/:optionId/items/:itemId
 * @access Private
 *
 * @example
 * GET /api/item-options/size-options-001/items/550e8400-e29b-41d4-a716-446655440001
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

    const result = await ItemOptionService.getItemDetails(optionId, itemId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
