/**
 * Count Business Item Option Groups Controller
 * Handles HTTP request for counting option groups
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Count business item option groups
 * @route GET /api/business-item-option-groups/count
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/count
 * GET /api/business-item-option-groups/count?filter={"description":{"$regex":"size"}}
 */
export const countItemOptionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};
    const result = await ItemOptionService.count(filter);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
