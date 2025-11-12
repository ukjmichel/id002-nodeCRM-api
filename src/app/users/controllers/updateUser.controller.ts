/**
 * Update User Controller
 * Handles HTTP request for updating a user
 */

import { Request, Response, NextFunction } from 'express';
import { updateUser } from '../services/updateUser.js';

/**
 * Update a user by ID
 * @route PUT /api/users/:id
 */
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await updateUser(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
