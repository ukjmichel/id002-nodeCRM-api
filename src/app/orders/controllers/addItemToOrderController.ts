/**
 * Add Item To Order Controller
 * Handles POST /api/orders/:id/items
 */

import { Request, Response, NextFunction } from 'express';
import { addItemToOrder } from '../services/order/index.js';

/**
 * Add an item to an order
 *
 * @route POST /api/orders/:id/items
 */
export const addItemToOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await addItemToOrder(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
