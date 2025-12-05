/**
 * Find Options By Item ID Controller
 * Handles HTTP request for retrieving all option groups for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Get all option groups for an item
 * @route GET /api/item-options/:itemId/options
 * @access Public
 *
 * @example
 * GET /api/item-options/550e8400-e29b-41d4-a716-446655440001/options
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "itemId": "550e8400-...", "optionId": "507f1f77...", "sortOrder": 1, "isRequired": true },
 *     { "itemId": "550e8400-...", "optionId": "507f1f78...", "sortOrder": 2, "isRequired": false }
 *   ],
 *   "count": 2,
 *   "message": "Found 2 option(s) for item"
 * }
 */
export const findOptionsByItemIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await ItemOptionService.findOptionsByItemId(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
