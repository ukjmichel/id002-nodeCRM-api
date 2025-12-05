/**
 * Find Item Option Controller
 * Handles HTTP request for retrieving a specific item-option relationship
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Get a specific item-option relationship
 * @route GET /api/item-options/:itemId/options/:optionId
 * @access Public
 *
 * @example
 * GET /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/507f1f77bcf86cd799439011
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "itemId": "550e8400-e29b-41d4-a716-446655440001",
 *     "optionId": "507f1f77bcf86cd799439011",
 *     "sortOrder": 1,
 *     "isRequired": true,
 *     "createdAt": "2024-01-01T00:00:00.000Z",
 *     "updatedAt": "2024-01-01T00:00:00.000Z"
 *   },
 *   "message": "Item-option relationship found"
 * }
 */
export const findItemOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId, optionId } = req.params;
    const result = await ItemOptionService.findItemOption(itemId, optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
