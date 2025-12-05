/**
 * Deactivate All Items Controller
 * Handles HTTP request for deactivating all items in an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Deactivate all items in an option group
 * @route POST /api/option-groups/:optionId/items/deactivate-all
 * @access Private
 *
 * @example
 * POST /api/option-groups/size-options-001/items/deactivate-all
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
    const result = await OptionGroupService.deactivateAllItems(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
