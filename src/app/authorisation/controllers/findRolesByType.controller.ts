// src/app/roles/controllers/findRolesByType.controller.ts
/**
 * Find Roles By Type Controller
 * Handles HTTP request for retrieving roles by type
 */

import { Request, Response, NextFunction } from 'express';
import { findRolesByType } from '../services/findRolesByType.js';
import { RoleType } from '../models/role.model.js';

/**
 * Get all roles of a specific type
 * @route GET /api/roles/type/:roleType
 */
export const findRolesByTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roleType } = req.params;
    const result = await findRolesByType(roleType as RoleType);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
