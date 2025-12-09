/**
 * Find Orders By Fulfillment Status Service
 * Retrieves all orders with a specific fulfillment status
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, FulfillmentStatus } from '../interfaces/order.interface.js';

/**
 * Options for findOrdersByFulfillmentStatus
 */
export interface FindOrdersByFulfillmentStatusOptions {
  /** Business ID to filter by */
  businessId?: string;
  /** Driver ID to filter by */
  driverId?: string;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all orders with a specific fulfillment status
 *
 * @param fulfillmentStatus - Fulfillment status to filter by
 * @param options - Query options (businessId, driverId, limit, skip)
 * @returns Array of orders with the specified fulfillment status
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const inTransitOrders = await findOrdersByFulfillmentStatus(FulfillmentStatus.IN_TRANSIT);
 * console.log(`Found ${inTransitOrders.count} orders in transit`);
 * ```
 */
export const findOrdersByFulfillmentStatus = async (
  fulfillmentStatus: FulfillmentStatus,
  options: FindOrdersByFulfillmentStatusOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    if (!fulfillmentStatus) {
      throw new ValidationError('Validation failed', 'Fulfillment status is required');
    }

    if (!Object.values(FulfillmentStatus).includes(fulfillmentStatus)) {
      throw new ValidationError(
        'Validation failed',
        `Invalid fulfillment status. Must be one of: ${Object.values(FulfillmentStatus).join(', ')}`
      );
    }

    const { businessId, driverId, limit, skip } = options;

    const filter: Record<string, unknown> = { fulfillmentStatus };
    if (businessId) {
      filter.businessId = businessId;
    }
    if (driverId) {
      filter.driverId = driverId;
    }

    let query = OrderModel.find(filter).sort({ createdAt: -1 });

    if (skip !== undefined) {
      query = query.skip(skip);
    }

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const records = await query.exec();
    const count = await OrderModel.countDocuments(filter);

    return {
      success: true,
      data: records,
      count,
      message:
        count === 0
          ? `No orders found with fulfillment status '${fulfillmentStatus}'`
          : `Found ${count} order(s) with fulfillment status '${fulfillmentStatus}'`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Orders by fulfillment status',
      error instanceof Error ? error.message : String(error)
    );
  }
};
