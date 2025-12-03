/**
 * Update Option Description Controller
 * Handles HTTP request for updating an option's description
 */

import { Request, Response, NextFunction } from 'express';
import { ItemOptionService } from '../services/item-options/index.js';

/**
 * Update the description of an option
 * @route PATCH /api/item-options/:optionId/description
 * @access Private
 *
 * @example
 * PATCH /api/item-options/size-options-001/description
 * Body: {
 *   "description": "Updated size options for all beverages"
 * }
 */
export const updateOptionDescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { optionId } = req.params;
    const { description } = req.body;

    const result = await ItemOptionService.updateOptionDescription(
      optionId,
      description
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
