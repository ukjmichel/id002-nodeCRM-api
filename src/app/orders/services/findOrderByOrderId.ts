/**
 * Find Order By OrderId Service
 * Retrieves a single order by its custom orderId field (e.g., ORD-20240101-00001)
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument } from '../interfaces/order.interface.js';

/**
 * Get a single order by orderId
 *
 * @param orderId - Order's custom identifier (e.g., ORD-20240101-00001)
 * @returns Single order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const order = await findOrderByOrderId('ORD-20240101-00001');
 * console.log(order.data.status);
 * ```
 */
export const findOrderByOrderId = async (
  orderId: string
): Promise<ApiResponse<IOrderDocument>> => {
  try {
    if (!orderId) {
      throw new ValidationError('Validation failed', 'Order ID is required');
    }

    const record = await OrderModel.findByOrderId(orderId);

    if (!record) {
      throw new NotFoundError(`Order with orderId '${orderId}' not found`);
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
