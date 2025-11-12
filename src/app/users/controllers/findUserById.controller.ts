/**
 * Find User By ID Controller
 * Handles HTTP request for retrieving a single user by ID
 */

import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../services/findUserById.js';

/**
 * Get a single user by ID
 * @route GET /api/users/:id
 */
export const findUserByIdController = async (
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

    const result = await findUserById(id, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
