// src/app/roles/controllers/countRoles.controller.ts
/**
 * Count Roles Controller
 * Handles HTTP request for counting roles
 */

import { Request, Response, NextFunction } from 'express';
import { countRoles } from '../services/countRoles.js';

/**
 * Count roles with optional filters
 * @route GET /api/roles/count
 */
export const countRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { where } = req.query;

    const whereClause = where ? JSON.parse(where as string) : {};

    const result = await countRoles(whereClause);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
