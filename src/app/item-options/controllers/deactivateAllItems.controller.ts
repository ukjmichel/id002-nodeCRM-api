/**
 * Deactivate All Items Controller
 * Handles HTTP request for deactivating all items in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Deactivate all items in an option
 * @route POST /api/item-options/:optionId/items/deactivate-all
 * @access Private
 *
 * @example
 * POST /api/item-options/size-options-001/items/deactivate-all
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { ... },
 *   "message": "5 item(s) deactivated successfully"
 * }
 */
export const deactivateAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;

    const result = await ItemOptionService.deactivateAllItems(optionId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
