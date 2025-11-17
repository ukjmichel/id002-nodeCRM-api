// src/app/users/controllers/updatePassword.controller.ts
/**
 * Update Password Controller
 * Handles HTTP request for updating a user's password
 */

import { Request, Response, NextFunction } from 'express';
import { updatePassword } from '../services/updatePassword.js';

/**
 * Update a user's password
 * @route PATCH /api/users/:id/password
 */
export const updatePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const result = await updatePassword(id, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
