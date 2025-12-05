/**
 * Delete Option Group Controller
 * Handles HTTP request for deleting an option group
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Delete an option group by ID
 * @route DELETE /api/option-groups/:id
 * @access Private
 *
 * @example
 * DELETE /api/option-groups/507f1f77bcf86cd799439011
 */
export const deleteOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await OptionGroupService.delete(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
