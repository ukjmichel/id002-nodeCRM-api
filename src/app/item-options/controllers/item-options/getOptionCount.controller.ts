/**
 * Get Option Count Controller
 * Handles HTTP request for getting the count of option groups for an item
 */

import { Request, Response, NextFunction } from 'express';
import ItemOptionService from '../../services/item-options/index.js';

/**
 * Get the count of option groups for an item
 * @route GET /api/item-options/:itemId/options/count
 * @access Public
 *
 * @example
 * GET /api/item-options/550e8400-e29b-41d4-a716-446655440001/options/count
 *
 * Response:
 * {
 *   "success": true,
 *   "data": 5,
 *   "count": 5,
 *   "message": "Item has 5 option group(s)"
 * }
 */
export const getOptionCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { itemId } = req.params;
    const result = await ItemOptionService.getOptionCount(itemId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
