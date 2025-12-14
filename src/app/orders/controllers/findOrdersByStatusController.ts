/**
 * Find Orders By Status Controller
 * Handles GET /api/orders/by-status/:status
 */

import { Request, Response, NextFunction } from 'express';
import { findOrdersByStatus } from '../services/index.js';
import { OrderStatus } from '../interfaces/order.interface.js';

/**
 * Get all orders with a specific status
 *
 * @route GET /api/orders/by-status/:status
 * @query businessId - Filter by business ID
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findOrdersByStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.params;
    const { businessId, limit, skip } = req.query;

    const result = await findOrdersByStatus(status as OrderStatus, {
      businessId: businessId as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
