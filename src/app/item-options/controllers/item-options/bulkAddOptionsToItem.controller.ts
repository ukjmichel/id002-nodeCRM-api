/**
 * Bulk Add Options To Item Controller
 * Handles HTTP request for adding multiple option groups to an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Add multiple option groups to an item at once
 * @route POST /api/item-options/:itemId/options/bulk
 * @access Private
 *
 * @example
 * POST /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/bulk
 * Body: {
 *   "options": [
 *     { "optionId": "507f1f77bcf86cd799439011", "sortOrder": 1, "isRequired": true },
 *     { "optionId": "507f1f77bcf86cd799439012", "sortOrder": 2, "isRequired": false }
 *   ]
 * }
 */
export const bulkAddOptionsToItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { options } = req.body;
    const result = await ItemOptionService.bulkAddOptionsToItem({
      itemId,
      options,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
