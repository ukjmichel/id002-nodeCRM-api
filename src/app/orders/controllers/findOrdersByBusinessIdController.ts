/**
 * Find Orders By Business ID Controller
 * Handles GET /api/orders/by-business/:businessId
 */

import { Request, Response, NextFunction } from 'express';
import { findOrdersByBusinessId } from '../services/index.js';

/**
 * Get all orders for a specific business
 *
 * @route GET /api/orders/by-business/:businessId
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 */
export const findOrdersByBusinessIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.params;
    const { limit, skip } = req.query;

    const result = await findOrdersByBusinessId(businessId, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
