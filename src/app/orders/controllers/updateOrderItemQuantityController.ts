/**
 * Update Order Item Quantity Controller
 * Handles PATCH /api/orders/:id/items/:itemId/quantity
 */

import { Request, Response, NextFunction } from 'express';
import { updateOrderItemQuantity } from '../services/index.js';

/**
 * Update the quantity of an item in an order
 *
 * @route PATCH /api/orders/:id/items/:itemId/quantity
 */
export const updateOrderItemQuantityController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, itemId } = req.params;
    const { quantity } = req.body;

    const result = await updateOrderItemQuantity(id, itemId, quantity);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
