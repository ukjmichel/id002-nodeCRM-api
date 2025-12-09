/**
 * Count Orders Service
 * Counts orders with optional filters
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument } from '../interfaces/order.interface.js';
import { FilterQuery } from 'mongoose';

/**
 * Count orders with optional filters
 *
 * @param filter - Filter criteria
 * @returns Count result
 * @throws {ValidationError} When count fails
 *
 * @example
 * ```typescript
 * const result = await countOrders({ status: 'pending' });
 * console.log(`There are ${result.data} pending orders`);
 * ```
 */
export const countOrders = async (
  filter: FilterQuery<IOrderDocument> = {}
): Promise<ApiResponse<number>> => {
  try {
    const count = await OrderModel.countDocuments(filter);

    return {
      success: true,
      data: count,
      count,
      message: 'Orders counted successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error counting Orders',
      error instanceof Error ? error.message : String(error)
    );
  }
};
