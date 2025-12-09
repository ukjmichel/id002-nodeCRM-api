/**
 * Find Orders By User ID Service
 * Retrieves all orders for a specific user
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument } from '../interfaces/order.interface.js';

/**
 * Options for findOrdersByUserId
 */
export interface FindOrdersByUserIdOptions {
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
}

/**
 * Get all orders for a specific user
 *
 * @param userId - User UUID
 * @param options - Query options (limit, skip)
 * @returns Array of orders for the user
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const orders = await findOrdersByUserId('550e8400-e29b-41d4-a716-446655440000');
 * console.log(`User has ${orders.count} orders`);
 * ```
 */
export const findOrdersByUserId = async (
  userId: string,
  options: FindOrdersByUserIdOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    if (!userId) {
      throw new ValidationError('Validation failed', 'User ID is required');
    }

    validateUuid(userId, 'User ID');

    const { limit, skip } = options;

    let query = OrderModel.find({ userId }).sort({ createdAt: -1 });

    if (skip !== undefined) {
      query = query.skip(skip);
    }

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    const records = await query.exec();
    const count = await OrderModel.countDocuments({ userId });

    return {
      success: true,
      data: records,
      count,
      message:
        count === 0
          ? 'No orders found for this user'
          : `Found ${count} order(s) for this user`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Orders by user ID',
      error instanceof Error ? error.message : String(error)
    );
  }
};
