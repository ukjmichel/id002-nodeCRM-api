/**
 * Delete Order Controller
 * Handles DELETE /api/orders/:id
 */

import { Request, Response, NextFunction } from 'express';
import { deleteOrder } from '../services/index.js';

/**
 * Delete an order (only cancelled or refunded orders)
 *
 * @route DELETE /api/orders/:id
 */
export const deleteOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await deleteOrder(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
