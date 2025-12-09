/**
 * Find Order By ID Service
 * Retrieves a single order by its MongoDB _id
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Get a single order by MongoDB _id
 *
 * @param id - Order MongoDB _id
 * @returns Single order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const order = await findOrderById('507f1f77bcf86cd799439011');
 * console.log(order.data.orderId);
 * ```
 */
export const findOrderById = async (
  id: string
): Promise<ApiResponse<IOrderDocument>> => {
  try {
    if (!id) {
      throw new ValidationError('Validation failed', 'Order ID is required');
    }

    if (!OBJECT_ID_REGEX.test(id)) {
      throw new ValidationError(
        'Validation failed',
        'Order ID must be a valid MongoDB ObjectId'
      );
    }

    const record = await OrderModel.findById(id);

    if (!record) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    return {
      success: true,
      data: record,
      message: 'Order retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error fetching Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
