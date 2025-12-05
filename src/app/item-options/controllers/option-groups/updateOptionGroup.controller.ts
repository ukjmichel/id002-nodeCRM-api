/**
 * Update Option Group Controller
 * Handles HTTP request for updating an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Update an option group by ID
 * @route PUT /api/option-groups/:id
 * @access Private
 *
 * @example
 * PUT /api/option-groups/507f1f77bcf86cd799439011
 * Body: {
 *   "description": "Updated size options"
 * }
 */
export const updateOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await OptionGroupService.update(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
