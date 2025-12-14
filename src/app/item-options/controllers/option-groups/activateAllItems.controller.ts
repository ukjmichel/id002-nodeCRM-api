/**
 * Activate All Items Controller
 * Handles HTTP request for activating all items in an option group
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';


/**
 * Activate all items in an option group
 * @route POST /api/option-groups/:optionId/items/activate-all
 * @access Private
 *
 * @example
 * POST /api/option-groups/size-options-001/items/activate-all
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
    const result = await OptionGroupService.activateAllItems(optionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
