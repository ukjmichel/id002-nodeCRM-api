/**
 * Find Active Orders Service
 * Retrieves all orders that are currently active (not completed, cancelled, or refunded)
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, OrderStatus } from '../interfaces/order.interface.js';

/**
 * Options for findActiveOrders
 */
export interface FindActiveOrdersOptions {
  /** Business ID to filter by */
  businessId?: string;
  /** User ID to filter by */
  userId?: string;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all active orders (not completed, cancelled, or refunded)
 *
 * @param options - Query options (businessId, userId, limit, skip)
 * @returns Array of active orders
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const activeOrders = await findActiveOrders({ businessId: 'uuid' });
 * console.log(`Found ${activeOrders.count} active orders`);
 * ```
 */
export const findActiveOrders = async (
  options: FindActiveOrdersOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    const { businessId, userId, limit, skip } = options;

    const filter: Record<string, unknown> = {
      status: {
        $in: [
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.PREPARING,
          OrderStatus.READY,
        ],
      },
    };

    if (businessId) {
      filter.businessId = businessId;
    }

    if (userId) {
      filter.userId = userId;
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
          ? 'No active orders found'
          : `Found ${count} active order(s)`,
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching active Orders',
      error instanceof Error ? error.message : String(error)
    );
  }
};
