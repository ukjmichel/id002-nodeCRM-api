/**
 * Count Orders Controller
 * Handles GET /api/orders/count
 */

import { Request, Response, NextFunction } from 'express';
import { countOrders } from '../services/order/index.js';

/**
 * Count orders with optional filters
 *
 * @route GET /api/orders/count
 * @query status - Filter by order status
 * @query fulfillmentStatus - Filter by fulfillment status
 * @query fulfillmentType - Filter by fulfillment type
 * @query paymentStatus - Filter by payment status
 * @query businessId - Filter by business ID
 * @query userId - Filter by user ID
 */
export const countOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      fulfillmentStatus,
      fulfillmentType,
      paymentStatus,
      businessId,
      userId,
    } = req.query;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (fulfillmentStatus) {
      filter.fulfillmentStatus = fulfillmentStatus;
    }

    if (fulfillmentType) {
      filter.fulfillmentType = fulfillmentType;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (businessId) {
      filter.businessId = businessId;
    }

    if (userId) {
      filter.userId = userId;
    }

    const result = await countOrders(filter);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
