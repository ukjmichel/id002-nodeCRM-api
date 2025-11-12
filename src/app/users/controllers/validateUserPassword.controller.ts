/**
 * Validate User Password Controller
 * Handles HTTP request for validating a user's password
 */

import { Request, Response, NextFunction } from 'express';
import { validateUserPassword } from '../services/validateUserPassword.js';

/**
 * Validate a user's password
 * @route POST /api/users/:id/validate-password
 */
export const validateUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    const result = await validateUserPassword(id, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
