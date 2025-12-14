/**
 * Update Menu Controller
 * @route PUT /api/menus/:id
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Update a menu by MongoDB _id
 * @route PUT /api/menus/:id
 * @access Private
 */
export const updateMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.update(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
