/**
 * Find Active Orders Controller
 * Handles GET /api/orders/active
 */

import { Request, Response, NextFunction } from 'express';
import { findActiveOrders } from '../services/index.js';

/**
 * Get all active orders (not completed, cancelled, or refunded)
 *
 * @route GET /api/orders/active
 * @query businessId - Filter by business ID
 * @query userId - Filter by user ID
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findActiveOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, userId, limit, skip } = req.query;

    const result = await findActiveOrders({
      businessId: businessId as string | undefined,
      userId: userId as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
