/**
 * Find Menu By ID Controller
 * @route GET /api/menus/:id
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Get a menu by MongoDB _id
 * @route GET /api/menus/:id
 * @access Private
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
