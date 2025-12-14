/**
 * Find Option Group By ID Controller
 * Handles HTTP request for retrieving an option group by MongoDB ID
 */

import { Request, Response, NextFunction } from 'express';
import OptionGroupService from '../../services/option-groups/index.js';

/**
 * Get an option group by ID
 * @route GET /api/option-groups/:id
 * @access Private
 *
 * @example
 * GET /api/option-groups/507f1f77bcf86cd799439011
 */
export const findOptionGroupByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await OptionGroupService.findById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
