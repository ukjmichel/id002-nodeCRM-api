/**
 * Create Order Controller
 * Handles POST /api/orders
 */

import { Request, Response, NextFunction } from 'express';
import { createOrder } from '../services/order/index.js';

/**
 * Create a new order
 *
 * @route POST /api/orders
 */
export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await createOrder(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
