/**
 * Find All Business Item Option Groups Controller
 * Handles HTTP request for retrieving all option groups
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Get all business item option groups
 * @route GET /api/business-item-option-groups
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups
 * GET /api/business-item-option-groups?page=1&limit=10
 */
export const findAllBusinessItemOptionGroupsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await businessItemOptionGroupService.findAll(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
