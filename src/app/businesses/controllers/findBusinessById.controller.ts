/**
 * Find Business By ID Controller
 * Handles HTTP request for retrieving a single business by ID
 */

import { Request, Response, NextFunction } from 'express';
import { findBusinessById } from '../services/findBusinessById.js';

/**
 * Get a single business by ID
 * @route GET /api/businesses/:id
 */
export const findBusinessByIdController = async (
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

    const result = await findBusinessById(id, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
