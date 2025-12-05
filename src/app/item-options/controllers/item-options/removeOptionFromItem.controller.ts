/**
 * Remove Option From Item Controller
 * Handles HTTP request for removing a single option group from an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Remove a single option group from an item
 * @route DELETE /api/item-options/:itemId/options/:optionId
 * @access Private
 *
 * @example
 * DELETE /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/507f1f77bcf86cd799439011
 */
export const removeOptionFromItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId, optionId } = req.params;
    const result = await ItemOptionService.removeOptionFromItem(itemId, optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
