/**
 * Find Pending Orders Controller
 * Handles GET /api/orders/pending
 */

import { Request, Response, NextFunction } from 'express';
import { findPendingOrders } from '../services/index.js';

/**
 * Get all pending orders (pending or confirmed status)
 *
 * @route GET /api/orders/pending
 * @query businessId - Filter by business ID
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findPendingOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, limit, skip } = req.query;

    const result = await findPendingOrders({
      businessId: businessId as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
