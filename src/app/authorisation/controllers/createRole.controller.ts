// src/app/roles/controllers/createRole.controller.ts
/**
 * Create Role Controller
 * Handles HTTP request for creating a new role
 */

import { Request, Response, NextFunction } from 'express';
import { createRole } from '../services/createRole.js';

/**
 * Create a new role
 * @route POST /api/roles
 */
export const createRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await createRole(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
