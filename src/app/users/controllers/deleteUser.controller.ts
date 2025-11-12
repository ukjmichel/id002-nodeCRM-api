/**
 * Delete User Controller
 * Handles HTTP request for deleting a user
 */

import { Request, Response, NextFunction } from 'express';
import { deleteUser } from '../services/deleteUser.js';

/**
 * Delete a user by ID
 * @route DELETE /api/users/:id
 */
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
