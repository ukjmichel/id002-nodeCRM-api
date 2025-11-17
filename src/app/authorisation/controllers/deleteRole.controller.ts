// src/app/roles/controllers/deleteRole.controller.ts
/**
 * Delete Role Controller
 * Handles HTTP request for deleting a role
 */

import { Request, Response, NextFunction } from 'express';
import { deleteRole } from '../services/deleteRole.js';

/**
 * Delete a role by user ID
 * @route DELETE /api/roles/:userId
 */
export const deleteRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await deleteRole(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
