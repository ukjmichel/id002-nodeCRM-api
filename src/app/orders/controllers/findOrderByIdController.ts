/**
 * Find Order By ID Controller
 * Handles GET /api/orders/:id
 */

import { Request, Response, NextFunction } from 'express';
import { findOrderById } from '../services/index.js';

/**
 * Get a single order by MongoDB _id
 *
 * @route GET /api/orders/:id
 */
export const findOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await findOrderById(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
