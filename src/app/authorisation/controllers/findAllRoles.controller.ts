// src/app/roles/controllers/findAllRoles.controller.ts
/**
 * Find All Roles Controller
 * Handles HTTP request for retrieving all roles with filters
 */

import { Request, Response, NextFunction } from 'express';
import { findAllRoles } from '../services/findAllRoles.js';

/**
 * Get all roles with optional filters and pagination
 * @route GET /api/roles
 */
export const findAllRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { where, limit, offset, order, include } = req.query;

    const options = {
      ...(where && { where: JSON.parse(where as string) }),
      ...(limit && { limit: parseInt(limit as string, 10) }),
      ...(offset && { offset: parseInt(offset as string, 10) }),
      ...(order && { order: JSON.parse(order as string) }),
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findAllRoles(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
