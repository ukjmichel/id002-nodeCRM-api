/**
 * Create User Controller
 * Handles HTTP request for creating a new user
 */

import { Request, Response, NextFunction } from 'express';
import { createUser } from '../services/createUser.js';

/**
 * Create a new user
 * @route POST /api/users
 */
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
