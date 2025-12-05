/**
 * Add Option To Item Controller
 * Handles HTTP request for adding a single option group to an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';


/**
 * Add a single option group to an item
 * @route POST /api/item-options/:itemId/options
 * @access Private
 *
 * @example
 * POST /api/item-options/550e8400-e29b-41d4-a716-446655440001/options
 * Body: {
 *   "optionId": "507f1f77bcf86cd799439011",
 *   "sortOrder": 1,
 *   "isRequired": true
 * }
 */
export const addOptionToItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { optionId, sortOrder, isRequired } = req.body;
    const result = await ItemOptionService.addOptionToItem({
      itemId,
      optionId,
      sortOrder,
      isRequired,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
