/**
 * Delete Menu Controller
 * @route DELETE /api/menus/:id
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Delete a menu by MongoDB _id
 * @route DELETE /api/menus/:id
 * @access Private
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
