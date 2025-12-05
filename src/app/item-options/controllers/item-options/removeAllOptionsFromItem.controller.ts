/**
 * Remove All Options From Item Controller
 * Handles HTTP request for removing all option groups from an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Remove all option groups from an item
 * @route DELETE /api/item-options/:itemId/options
 * @access Private
 *
 * @example
 * DELETE /api/item-options/550e8400-e29b-41d4-a716-446655440001/options
 */
export const removeAllOptionsFromItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await ItemOptionService.removeAllOptionsFromItem(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
