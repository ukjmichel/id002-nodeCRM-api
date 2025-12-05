/**
 * Replace Item Options Controller
 * Handles HTTP request for replacing all option groups for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Replace all option groups for an item with a new set
 * @route PUT /api/item-options/:itemId/options
 * @access Private
 *
 * @example
 * PUT /api/item-options/550e8400-e29b-41d4-a716-446655440001/options
 * Body: {
 *   "options": [
 *     { "optionId": "507f1f77bcf86cd799439011", "sortOrder": 1, "isRequired": true },
 *     { "optionId": "507f1f77bcf86cd799439012", "sortOrder": 2, "isRequired": false }
 *   ]
 * }
 */
export const replaceItemOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { options } = req.body;
    const result = await ItemOptionService.replaceItemOptions({
      itemId,
      options,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
