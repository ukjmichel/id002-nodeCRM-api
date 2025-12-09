/**
 * Assign Driver Controller
 * Handles POST /api/orders/:id/assign-driver
 */

import { Request, Response, NextFunction } from 'express';
import { assignDriver } from '../services/order/index.js';

/**
 * Assign a driver to an order
 *
 * @route POST /api/orders/:id/assign-driver
 */
export const assignDriverController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await assignDriver(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
