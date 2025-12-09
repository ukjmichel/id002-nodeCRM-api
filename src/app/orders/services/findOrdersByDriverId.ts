/**
 * Find Orders By Driver ID Service
 * Retrieves all orders assigned to a specific driver
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, FulfillmentStatus } from '../interfaces/order.interface.js';

/**
 * Options for findOrdersByDriverId
 */
export interface FindOrdersByDriverIdOptions {
  /** Only active deliveries (not delivered or failed) */
  activeOnly?: boolean;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all orders assigned to a specific driver
 *
 * @param driverId - Driver ID
 * @param options - Query options (activeOnly, limit, skip)
 * @returns Array of orders for the driver
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const driverOrders = await findOrdersByDriverId('driver-123', { activeOnly: true });
 * console.log(`Driver has ${driverOrders.count} active deliveries`);
 * ```
 */
export const findOrdersByDriverId = async (
  driverId: string,
  options: FindOrdersByDriverIdOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    if (!driverId) {
      throw new ValidationError('Validation failed', 'Driver ID is required');
    }

    const { activeOnly, limit, skip } = options;

    const filter: Record<string, unknown> = { driverId };

    if (activeOnly) {
      filter.fulfillmentStatus = {
        $in: [
          FulfillmentStatus.ASSIGNED,
          FulfillmentStatus.PICKED_UP,
          FulfillmentStatus.IN_TRANSIT,
          FulfillmentStatus.ARRIVED,
        ],
      };
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
          ? 'No orders found for this driver'
          : `Found ${count} order(s) for this driver`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Orders by driver ID',
      error instanceof Error ? error.message : String(error)
    );
  }
};
