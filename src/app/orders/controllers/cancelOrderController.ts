/**
 * Cancel Order Controller
 * Handles POST /api/orders/:id/cancel
 */

import { Request, Response, NextFunction } from 'express';
import { cancelOrder } from '../services/order/index.js';

/**
 * Cancel an order
 *
 * @route POST /api/orders/:id/cancel
 */
export const cancelOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await cancelOrder(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
