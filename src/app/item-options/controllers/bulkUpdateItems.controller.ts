/**
 * Bulk Update Items Controller
 * Handles HTTP request for bulk updating items in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/index.js';

/**
 * Bulk update items in an option
 * @route PATCH /api/item-options/:optionId/items/bulk
 * @access Private
 *
 * @example
 * PATCH /api/item-options/size-options-001/items/bulk
 * Body: {
 *   "updates": [
 *     { "itemId": "550e8400-e29b-41d4-a716-446655440001", "maxQuantity": 5 },
 *     { "itemId": "550e8400-e29b-41d4-a716-446655440002", "active": false },
 *     { "itemId": "550e8400-e29b-41d4-a716-446655440003", "maxQuantity": 10, "active": true }
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { ... },
 *   "message": "3 item(s) updated successfully"
 * }
 */
export const bulkUpdateItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { updates } = req.body;

    const result = await ItemOptionService.bulkUpdateItems(optionId, updates);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
