/**
 * Activate All Items Controller
 * Handles HTTP request for activating all items in an option
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Activate all items in an option
 * @route POST /api/item-options/:optionId/items/activate-all
 * @access Private
 *
 * @example
 * POST /api/item-options/size-options-001/items/activate-all
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { ... },
 *   "message": "5 item(s) activated successfully"
 * }
 */
export const activateAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;

    const result = await ItemOptionService.activateAllItems(optionId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
