/**
 * Delete Business Item Option Group Controller
 * Handles HTTP request for deleting an option group
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Delete a business item option group by ID
 * @route DELETE /api/business-item-option-groups/:id
 * @access Private
 *
 * @example
 * DELETE /api/business-item-option-groups/507f1f77bcf86cd799439011
 */
export const deleteBusinessItemOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await businessItemOptionGroupService.delete(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
