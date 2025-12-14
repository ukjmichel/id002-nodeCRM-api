/**
 * Update Order Status Controller
 * Handles PATCH /api/orders/:id/status
 */

import { Request, Response, NextFunction } from 'express';
import { updateOrderStatus } from '../services/index.js';

/**
 * Update order status
 *
 * @route PATCH /api/orders/:id/status
 */
export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await updateOrderStatus(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
