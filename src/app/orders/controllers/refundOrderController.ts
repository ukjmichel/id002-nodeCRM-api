/**
 * Refund Order Controller
 * Handles POST /api/orders/:id/refund
 */

import { Request, Response, NextFunction } from 'express';
import { refundOrder } from '../services/order/index.js';

/**
 * Refund an order
 *
 * @route POST /api/orders/:id/refund
 */
export const refundOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await refundOrder(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
