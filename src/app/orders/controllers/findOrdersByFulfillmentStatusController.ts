/**
 * Find Orders By Fulfillment Status Controller
 * Handles GET /api/orders/by-fulfillment-status/:status
 */

import { Request, Response, NextFunction } from 'express';
import { findOrdersByFulfillmentStatus } from '../services/index.js';
import { FulfillmentStatus } from '../interfaces/order.interface.js';

/**
 * Get all orders with a specific fulfillment status
 *
 * @route GET /api/orders/by-fulfillment-status/:status
 * @query businessId - Filter by business ID
 * @query driverId - Filter by driver ID
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findOrdersByFulfillmentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.params;
    const { businessId, driverId, limit, skip } = req.query;

    const result = await findOrdersByFulfillmentStatus(status as FulfillmentStatus, {
      businessId: businessId as string | undefined,
      driverId: driverId as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
