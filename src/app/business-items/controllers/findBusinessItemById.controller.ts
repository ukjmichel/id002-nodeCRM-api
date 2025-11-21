/**
 * Find Business Item By ID Controller
 * Handles HTTP request for retrieving a single business item by ID
 */

import { Request, Response, NextFunction } from 'express';
import { findBusinessItemById } from '../services/findBusinessItemById.js';

/**
 * Get a single business item by ID
 * @route GET /api/business-items/:id
 *
 * @example
 * GET /api/business-items/123e4567-e89b-12d3-a456-426614174000
 */
export const findBusinessItemByIdController = async (
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

    const result = await findBusinessItemById(id, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
