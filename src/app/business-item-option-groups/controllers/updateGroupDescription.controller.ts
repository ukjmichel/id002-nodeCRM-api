/**
 * Update Group Description Controller
 * Handles HTTP request for updating an option group's description
 */

import { Request, Response, NextFunction } from 'express';
import { businessItemOptionGroupService } from '../services/index.js';

/**
 * Update the description of an option group
 * @route PATCH /api/business-item-option-groups/:optionId/description
 * @access Private
 *
 * @example
 * PATCH /api/business-item-option-groups/size-options-001/description
 * Body: {
 *   "description": "Updated size options for all beverages"
 * }
 */
export const updateGroupDescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { description } = req.body;
    const result = await businessItemOptionGroupService.updateGroupDescription(
      optionId,
      description
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
