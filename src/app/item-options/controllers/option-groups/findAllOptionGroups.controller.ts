/**
 * Find All Option Groups Controller
 * Handles HTTP request for retrieving all option groups
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Get all option groups
 * @route GET /api/option-groups
 * @access Private
 *
 * @example
 * GET /api/option-groups
 * GET /api/option-groups?page=1&limit=10
 */
export const findAllOptionGroupsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OptionGroupService.findAll(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
