/**
 * Update Menu Controller
 * Handles HTTP request for updating a menu by MongoDB _id
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Update a menu by its MongoDB _id
 * @route PUT /api/menus/:id
 * @access Private
 *
 * @example
 * PUT /api/menus/507f1f77bcf86cd799439011
 * Body: {
 *   "name": "Updated Lunch Menu",
 *   "description": "Updated description"
 * }
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
