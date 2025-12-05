/**
 * Count Option Groups Controller
 * Handles HTTP request for counting option groups
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Count option groups
 * @route GET /api/option-groups/count
 * @access Private
 *
 * @example
 * GET /api/option-groups/count
 * GET /api/option-groups/count?filter={"description":{"$regex":"size"}}
 */
export const countOptionGroupsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};
    const result = await OptionGroupService.count(filter);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
