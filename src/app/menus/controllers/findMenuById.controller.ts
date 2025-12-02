/**
 * Find Menu By ID Controller
 * Handles HTTP request for fetching a menu by MongoDB _id
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Find a menu by its MongoDB _id
 * @route GET /api/menus/:id
 * @access Private
 *
 * @example
 * GET /api/menus/507f1f77bcf86cd799439011
 */
export const findMenuByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await MenuService.findById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
