/**
 * Find Menus By Name Controller
 * @route GET /api/menus/search/by-name
 */

import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/index.js';

/**
 * Search menus by name
 * @route GET /api/menus/search/by-name?name=lunch
 * @access Private
 */
export const findMenusByNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.query;
    const result = await MenuService.findByName(name as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
