/**
 * Find Items By Option ID Controller
 * Handles HTTP request for retrieving all items for an option group
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Get all items for an option group
 * @route GET /api/item-options/by-option/:optionId
 * @access Public
 *
 * @example
 * GET /api/item-options/by-option/507f1f77bcf86cd799439011
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     { "itemId": "550e8400-...", "optionId": "507f1f77...", "sortOrder": 1, "isRequired": true },
 *     { "itemId": "550e8401-...", "optionId": "507f1f77...", "sortOrder": 0, "isRequired": false }
 *   ],
 *   "count": 2,
 *   "message": "Found 2 item(s) for option group"
 * }
 */
export const findItemsByOptionIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const result = await ItemOptionService.findItemsByOptionId(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
