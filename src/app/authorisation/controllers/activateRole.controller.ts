// src/app/roles/controllers/activateRole.controller.ts
/**
 * Activate Role Controller
 * Handles HTTP request for activating a role
 */

import { Request, Response, NextFunction } from 'express';
import { activateRole } from '../services/activateRole.js';

/**
 * Activate a role
 * @route PATCH /api/roles/:userId/activate
 */
export const activateRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const result = await activateRole(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
