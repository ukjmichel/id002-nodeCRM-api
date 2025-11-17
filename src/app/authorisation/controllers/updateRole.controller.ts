// src/app/roles/controllers/updateRole.controller.ts
/**
 * Update Role Controller
 * Handles HTTP request for updating a role
 */

import { Request, Response, NextFunction } from 'express';
import { updateRole } from '../services/updateRole.js';

/**
 * Update a role by user ID
 * @route PUT /api/roles/:userId
 */
export const updateRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await updateRole(userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
