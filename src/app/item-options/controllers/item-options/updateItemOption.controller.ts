/**
 * Update Item Option Controller
 * Handles HTTP request for updating an item-option relationship
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Update an item-option relationship
 * @route PATCH /api/item-options/:itemId/options/:optionId
 * @access Private
 *
 * @example
 * PATCH /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/507f1f77bcf86cd799439011
 * Body: {
 *   "sortOrder": 5,
 *   "isRequired": true
 * }
 */
export const updateItemOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId, optionId } = req.params;
    const { sortOrder, isRequired } = req.body;
    const result = await ItemOptionService.updateItemOption(itemId, optionId, {
      sortOrder,
      isRequired,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
