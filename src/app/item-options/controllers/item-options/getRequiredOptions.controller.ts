/**
 * Get Required Options Controller
 * Handles HTTP request for getting all required option groups for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Get all required option groups for an item
 * @route GET /api/item-options/:itemId/options/required
 * @access Public
 *
 * @example
 * GET /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/required
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "itemId": "550e8400-...", "optionId": "507f1f77...", "sortOrder": 1, "isRequired": true }
 *   ],
 *   "count": 1,
 *   "message": "Found 1 required option(s) for item"
 * }
 */
export const getRequiredOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await ItemOptionService.getRequiredOptions(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
