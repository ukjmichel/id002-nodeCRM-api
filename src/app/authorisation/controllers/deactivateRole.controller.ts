// src/app/roles/controllers/deactivateRole.controller.ts
/**
 * Deactivate Role Controller
 * Handles HTTP request for deactivating a role
 */

import { Request, Response, NextFunction } from 'express';
import { deactivateRole } from '../services/deactivateRole.js';

/**
 * Deactivate a role
 * @route PATCH /api/roles/:userId/deactivate
 */
export const deactivateRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await deactivateRole(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
