/**
 * Find All Orders Controller
 * Handles GET /api/orders
 */

import { Request, Response, NextFunction } from 'express';
import { findAllOrders } from '../services/order/index.js';

/**
 * Get all orders with optional filters and pagination
 *
 * @route GET /api/orders
 * @query limit - Number of records to return
 * @query skip - Number of records to skip
 * @query sort - Sort field (prefix with - for descending)
 * @query status - Filter by order status
 * @query fulfillmentStatus - Filter by fulfillment status
 * @query fulfillmentType - Filter by fulfillment type
 * @query paymentStatus - Filter by payment status
 */
export const findAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      limit,
      skip,
      sort,
      status,
      fulfillmentStatus,
      fulfillmentType,
      paymentStatus,
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

    // Build sort
    let sortObj: Record<string, 1 | -1> | undefined;
    if (sort && typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortObj = { [sortField]: sortOrder };
    }

    const result = await findAllOrders({
      filter,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      skip: skip ? parseInt(skip as string, 10) : undefined,
      sort: sortObj,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
