/**
 * Reorder Options Controller
 * Handles HTTP request for reordering all option groups for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Reorder all option groups for an item
 * @route PATCH /api/item-options/:itemId/options/reorder
 * @access Private
 *
 * @example
 * PATCH /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/reorder
 * Body: {
 *   "optionIds": [
 *     "507f1f77bcf86cd799439012",
 *     "507f1f77bcf86cd799439011",
 *     "507f1f77bcf86cd799439013"
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "message": "Reordered 3 option(s) successfully"
 * }
 */
export const reorderOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { optionIds } = req.body;
    const result = await ItemOptionService.reorderOptions(itemId, optionIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
