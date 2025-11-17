// src/app/roles/controllers/bulkCreateRoles.controller.ts
/**
 * Bulk Create Roles Controller
 * Handles HTTP request for creating multiple roles
 */

import { Request, Response, NextFunction } from 'express';
import { bulkCreateRoles } from '../services/bulkCreateRoles.js';

/**
 * Bulk create roles
 * @route POST /api/roles/bulk
 */
export const bulkCreateRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roles } = req.body;
    const result = await bulkCreateRoles(roles);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
