/**
 * Find Orders By Business ID Service
 * Retrieves all orders for a specific business
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument } from '../interfaces/order.interface.js';

/**
 * Options for findOrdersByBusinessId
 */
export interface FindOrdersByBusinessIdOptions {
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all orders for a specific business
 *
 * @param businessId - Business UUID
 * @param options - Query options (limit, skip)
 * @returns Array of orders for the business
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const orders = await findOrdersByBusinessId('550e8400-e29b-41d4-a716-446655440000');
 * console.log(`Business has ${orders.count} orders`);
 * ```
 */
export const findOrdersByBusinessId = async (
  businessId: string,
  options: FindOrdersByBusinessIdOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    if (!businessId) {
      throw new ValidationError('Validation failed', 'Business ID is required');
    }

    validateUuid(businessId, 'Business ID');

    const { limit, skip } = options;

    let query = OrderModel.find({ businessId }).sort({ createdAt: -1 });

    if (skip !== undefined) {
      query = query.skip(skip);
    }

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const records = await query.exec();
    const count = await OrderModel.countDocuments({ businessId });

    return {
      success: true,
      data: records,
      count,
      message:
        count === 0
          ? 'No orders found for this business'
          : `Found ${count} order(s) for this business`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Orders by business ID',
      error instanceof Error ? error.message : String(error)
    );
  }
};
