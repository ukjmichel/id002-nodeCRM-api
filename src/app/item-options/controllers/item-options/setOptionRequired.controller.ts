/**
 * Set Option Required Controller
 * Handles HTTP request for setting the required status of an option group for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Set the required status of an option group for an item
 * @route PATCH /api/item-options/:itemId/options/:optionId/required
 * @access Private
 *
 * @example
 * PATCH /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/507f1f77bcf86cd799439011/required
 * Body: {
 *   "isRequired": true
 * }
 */
export const setOptionRequiredController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId, optionId } = req.params;
    const { isRequired } = req.body;
    const result = await ItemOptionService.setOptionRequired(
      itemId,
      optionId,
      isRequired
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
