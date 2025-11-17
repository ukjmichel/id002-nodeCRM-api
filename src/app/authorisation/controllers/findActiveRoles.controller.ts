// src/app/roles/controllers/findActiveRoles.controller.ts
/**
 * Find Active Roles Controller
 * Handles HTTP request for retrieving active roles
 */

import { Request, Response, NextFunction } from 'express';
import { findActiveRoles } from '../services/findActiveRoles.js';

/**
 * Get all active roles
 * @route GET /api/roles/active
 */
export const findActiveRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await findActiveRoles();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
