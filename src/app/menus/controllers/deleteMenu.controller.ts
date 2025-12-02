/**
 * Delete Menu Controller
 * Handles HTTP request for deleting a menu by MongoDB _id
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Delete a menu by its MongoDB _id
 * @route DELETE /api/menus/:id
 * @access Private
 *
 * @example
 * DELETE /api/menus/507f1f77bcf86cd799439011
 */
export const deleteMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.delete(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
