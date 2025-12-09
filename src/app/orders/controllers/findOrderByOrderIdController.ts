/**
 * Find Order By OrderId Controller
 * Handles GET /api/orders/by-order-id/:orderId
 */

import { Request, Response, NextFunction } from 'express';
import { findOrderByOrderId } from '../services/order/index.js';

/**
 * Get a single order by orderId (e.g., ORD-20240101-00001)
 *
 * @route GET /api/orders/by-order-id/:orderId
 */
export const findOrderByOrderIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;

    const result = await findOrderByOrderId(orderId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
