/**
 * Find Business Item By ID Controller
 * Handles HTTP request for retrieving a single business item by ID
 */

import { Request, Response, NextFunction } from 'express';
import { findItemById } from '../services/findItemById.js';

/**
 * Get a single business item by ID
 * @route GET /api/items/:id
 *
 * @example
 * GET /api/items/123e4567-e89b-12d3-a456-426614174000
 */
export const findItemByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { include } = req.query;

    const options = {
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findItemById(id, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
