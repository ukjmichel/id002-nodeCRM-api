/**
 * Update Sort Order Controller
 * Handles HTTP request for updating the sort order of an option group for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Update the sort order of an option group for an item
 * @route PATCH /api/item-options/:itemId/options/:optionId/sort-order
 * @access Private
 *
 * @example
 * PATCH /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/507f1f77bcf86cd799439011/sort-order
 * Body: {
 *   "sortOrder": 5
 * }
 */
export const updateSortOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId, optionId } = req.params;
    const { sortOrder } = req.body;
    const result = await ItemOptionService.updateSortOrder(
      itemId,
      optionId,
      sortOrder
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
