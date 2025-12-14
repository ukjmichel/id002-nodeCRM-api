/**
 * Mark Order As Paid Controller
 * Handles POST /api/orders/:id/pay
 */

import { Request, Response, NextFunction } from 'express';
import { markOrderAsPaid } from '../services/index.js';

/**
 * Mark an order as paid
 *
 * @route POST /api/orders/:id/pay
 */
export const markOrderAsPaidController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await markOrderAsPaid(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
