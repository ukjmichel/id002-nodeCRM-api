/**
 * Find Orders By Status Service
 * Retrieves all orders with a specific status
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, OrderStatus } from '../interfaces/order.interface.js';

/**
 * Options for findOrdersByStatus
 */
export interface FindOrdersByStatusOptions {
  /** Business ID to filter by */
  businessId?: string;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all orders with a specific status
 *
 * @param status - Order status to filter by
 * @param options - Query options (businessId, limit, skip)
 * @returns Array of orders with the specified status
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const pendingOrders = await findOrdersByStatus(OrderStatus.PENDING);
 * console.log(`Found ${pendingOrders.count} pending orders`);
 * ```
 */
export const findOrdersByStatus = async (
  status: OrderStatus,
  options: FindOrdersByStatusOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    if (!status) {
      throw new ValidationError('Validation failed', 'Status is required');
    }

    if (!Object.values(OrderStatus).includes(status)) {
      throw new ValidationError(
        'Validation failed',
        `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}`
      );
    }

    const { businessId, limit, skip } = options;

    const filter: Record<string, unknown> = { status };
    if (businessId) {
      filter.businessId = businessId;
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
          ? `No orders found with status '${status}'`
          : `Found ${count} order(s) with status '${status}'`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Orders by status',
      error instanceof Error ? error.message : String(error)
    );
  }
};
