/**
 * Find Orders By User ID Controller
 * Handles GET /api/orders/by-user/:userId
 */

import { Request, Response, NextFunction } from 'express';
import { findOrdersByUserId } from '../services/order/index.js';

/**
 * Get all orders for a specific user
 *
 * @route GET /api/orders/by-user/:userId
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findOrdersByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { limit, skip } = req.query;

    const result = await findOrdersByUserId(userId, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
