// src/app/users/controllers/unverifyUser.controller.ts
/**
 * Unverify User Controller
 * Handles HTTP request for unverifying a user account
 */

import { Request, Response, NextFunction } from 'express';
import { unverifyUser } from '../services/unverifyUser.js';

/**
 * Unverify a user account
 * @route PATCH /api/users/:id/unverify
 */
export const unverifyUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await unverifyUser(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
