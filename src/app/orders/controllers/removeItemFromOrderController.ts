/**
 * Remove Item From Order Controller
 * Handles DELETE /api/orders/:id/items/:itemId
 */

import { Request, Response, NextFunction } from 'express';
import { removeItemFromOrder } from '../services/index.js';

/**
 * Remove an item from an order
 *
 * @route DELETE /api/orders/:id/items/:itemId
 */
export const removeItemFromOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, itemId } = req.params;

    const result = await removeItemFromOrder(id, itemId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
