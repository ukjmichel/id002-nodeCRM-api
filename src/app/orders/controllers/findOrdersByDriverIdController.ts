/**
 * Find Orders By Driver ID Controller
 * Handles GET /api/orders/by-driver/:driverId
 */

import { Request, Response, NextFunction } from 'express';
import { findOrdersByDriverId } from '../services/order/index.js';

/**
 * Get all orders assigned to a specific driver
 *
 * @route GET /api/orders/by-driver/:driverId
 * @query activeOnly - Only return active deliveries
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findOrdersByDriverIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { driverId } = req.params;
    const { activeOnly, limit, skip } = req.query;

    const result = await findOrdersByDriverId(driverId, {
      activeOnly: activeOnly === 'true',
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
