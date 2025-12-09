/**
 * Find Pending Orders Service
 * Retrieves all orders that are pending or confirmed
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, OrderStatus } from '../interfaces/order.interface.js';

/**
 * Options for findPendingOrders
 */
export interface FindPendingOrdersOptions {
  /** Business ID to filter by */
  businessId?: string;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all pending orders (pending or confirmed status)
 *
 * @param options - Query options (businessId, limit, skip)
 * @returns Array of pending orders
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const pendingOrders = await findPendingOrders({ businessId: 'uuid' });
 * console.log(`Found ${pendingOrders.count} pending orders`);
 * ```
 */
export const findPendingOrders = async (
  options: FindPendingOrdersOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    const { businessId, limit, skip } = options;

    const filter: Record<string, unknown> = {
      status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
    };

    if (businessId) {
      filter.businessId = businessId;
    }

    let query = OrderModel.find(filter).sort({ createdAt: 1 }); // Oldest first

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
          ? 'No pending orders found'
          : `Found ${count} pending order(s)`,
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching pending Orders',
      error instanceof Error ? error.message : String(error)
    );
  }
};
