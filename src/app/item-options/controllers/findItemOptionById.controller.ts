/**
 * Find Business Item Option Group By ID Controller
 * Handles HTTP request for retrieving an option group by MongoDB ID
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Get a business item option group by ID
 * @route GET /api/business-item-option-groups/:id
 * @access Private
 *
 * @example
 * GET /api/business-item-option-groups/507f1f77bcf86cd799439011
 */
export const findItemOptionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ItemOptionService.findById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
