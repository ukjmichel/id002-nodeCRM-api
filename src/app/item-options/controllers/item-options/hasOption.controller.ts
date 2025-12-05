/**
 * Has Option Controller
 * Handles HTTP request for checking if an item has a specific option group
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Check if an item has a specific option group
 * @route GET /api/item-options/:itemId/options/:optionId/exists
 * @access Public
 *
 * @example
 * GET /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/507f1f77bcf86cd799439011/exists
 *
 * Response:
 * {
 *   "success": true,
 *   "data": true,
 *   "message": "Item has this option group"
 * }
 */
export const hasOptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId, optionId } = req.params;
    const result = await ItemOptionService.hasOption(itemId, optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
