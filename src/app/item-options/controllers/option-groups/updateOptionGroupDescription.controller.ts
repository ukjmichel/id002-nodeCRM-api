/**
 * Update Option Group Description Controller
 * Handles HTTP request for updating an option group's description
 */

import { Request, Response, NextFunction } from 'express';
import { OptionGroupService } from '../services/option-group/index.js';

/**
 * Update an option group's description
 * @route PATCH /api/option-groups/:optionId/description
 * @access Private
 *
 * @example
 * PATCH /api/option-groups/size-options-001/description
 * Body: {
 *   "description": "Updated size options for all beverages"
 * }
 */
export const updateOptionGroupDescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { description } = req.body;
    const result = await OptionGroupService.updateOptionGroupDescription(
      optionId,
      description
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
