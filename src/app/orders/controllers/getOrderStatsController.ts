/**
 * Get Order Stats Controller
 * Handles GET /api/orders/stats
 */

import { Request, Response, NextFunction } from 'express';
import { getOrderStats } from '../services/index.js';

/**
 * Get order statistics
 *
 * @route GET /api/orders/stats
 * @query businessId - Filter by business ID
 * @query userId - Filter by user ID
 * @query startDate - Start date for stats period (ISO format)
 * @query endDate - End date for stats period (ISO format)
 */
export const getOrderStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, userId, startDate, endDate } = req.query;

    const result = await getOrderStats({
      businessId: businessId as string | undefined,
      userId: userId as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
