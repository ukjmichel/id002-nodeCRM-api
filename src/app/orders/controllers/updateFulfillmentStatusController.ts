/**
 * Update Fulfillment Status Controller
 * Handles PATCH /api/orders/:id/fulfillment-status
 */

import { Request, Response, NextFunction } from 'express';
import { updateFulfillmentStatus } from '../services/order/index.js';

/**
 * Update fulfillment status (delivery/pickup tracking)
 *
 * @route PATCH /api/orders/:id/fulfillment-status
 */
export const updateFulfillmentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await updateFulfillmentStatus(id, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
