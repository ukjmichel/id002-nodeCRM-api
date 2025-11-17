// src/app/users/controllers/verifyUser.controller.ts
/**
 * Verify User Controller
 * Handles HTTP request for verifying a user account
 */

import { Request, Response, NextFunction } from 'express';
import { verifyUser } from '../services/verifyUser.js';

/**
 * Verify a user account
 * @route PATCH /api/users/:id/verify
 */
export const verifyUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await verifyUser(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
