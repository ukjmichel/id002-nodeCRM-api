/**
 * Update Business Item Option Group Controller
 * Handles HTTP request for updating an option group by MongoDB ID
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Update a business item option group by ID
 * @route PUT /api/business-item-option-groups/:id
 * @access Private
 *
 * @example
 * PUT /api/business-item-option-groups/507f1f77bcf86cd799439011
 * Body: {
 *   "description": "Updated description"
 * }
 */
export const updateBusinessItemOptionGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await businessItemOptionGroupService.update(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
