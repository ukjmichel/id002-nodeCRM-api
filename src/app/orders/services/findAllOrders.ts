/**
 * Find All Orders Service
 * Retrieves all orders with optional filters and pagination
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument } from '../interfaces/order.interface.js';
import { FilterQuery } from 'mongoose';

/**
 * Options for findAllOrders
 */
export interface FindAllOrdersOptions {
  /** Filter criteria */
  filter?: FilterQuery<IOrderDocument>;
  /** Number of records to return */
  limit?: number;
  /** Number of records to skip */
  skip?: number;
  /** Sort order */
  sort?: Record<string, 1 | -1>;
}

/**
 * Get all orders with optional filters and pagination
 *
 * @param options - Query options (filter, limit, skip, sort)
 * @returns Array of orders with count
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const orders = await findAllOrders({
 *   filter: { status: 'pending' },
 *   limit: 10,
 *   skip: 0,
 *   sort: { createdAt: -1 }
 * });
 * ```
 */
export const findAllOrders = async (
  options: FindAllOrdersOptions = {}
): Promise<ApiResponse<IOrderDocument[]>> => {
  try {
    const { filter = {}, limit, skip, sort = { createdAt: -1 } } = options;

    let query = OrderModel.find(filter);

    if (sort) {
      query = query.sort(sort);
    }

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
      message: 'Orders retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error fetching Orders',
      error instanceof Error ? error.message : String(error)
    );
  }
};
