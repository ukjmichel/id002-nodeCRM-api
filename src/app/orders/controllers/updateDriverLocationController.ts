/**
 * Update Driver Location Controller
 * Handles PATCH /api/orders/:id/driver-location
 */

import { Request, Response, NextFunction } from 'express';
import { updateDriverLocation } from '../services/index.js';

/**
 * Update driver location for an order
 *
 * @route PATCH /api/orders/:id/driver-location
 */
export const updateDriverLocationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await updateDriverLocation(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
