/**
 * Update Order Controller
 * Handles PATCH /api/orders/:id
 */

import { Request, Response, NextFunction } from 'express';
import { updateOrder } from '../services/order/index.js';

/**
 * Update an order
 *
 * @route PATCH /api/orders/:id
 */
export const updateOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await updateOrder(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
