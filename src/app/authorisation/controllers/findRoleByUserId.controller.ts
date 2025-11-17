// src/app/roles/controllers/findRoleByUserId.controller.ts
/**
 * Find Role By User ID Controller
 * Handles HTTP request for retrieving a role by user ID
 */

import { Request, Response, NextFunction } from 'express';
import { findRoleById } from '../services/findRoleById.js';

/**
 * Get a role by user ID
 * @route GET /api/roles/user/:userId
 */
export const findRoleByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { include } = req.query;

    const options = {
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findRoleById(userId, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
