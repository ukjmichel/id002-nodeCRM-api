/**
 * Delete Order Service
 * Deletes an order record (soft delete recommended in production)
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Delete an order by MongoDB _id
 * Note: In production, consider using soft delete instead
 *
 * @param id - Order MongoDB _id
 * @returns Deletion confirmation
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * await deleteOrder('507f1f77bcf86cd799439011');
 * ```
 */
export const deleteOrder = async (id: string): Promise<ApiResponse<void>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE ID
    // ========================================================================

    if (!id) {
      throw new ValidationError('Validation failed', 'Order ID is required');
    }

    if (!OBJECT_ID_REGEX.test(id)) {
      throw new ValidationError(
        'Validation failed',
        'Order ID must be a valid MongoDB ObjectId'
      );
    }

    // ========================================================================
    // STEP 2: FIND ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE ORDER CAN BE DELETED
    // ========================================================================

    // Only allow deletion of cancelled or refunded orders
    const deletableStatuses = [OrderStatus.CANCELLED, OrderStatus.REFUNDED];

    if (!deletableStatuses.includes(order.status as OrderStatus)) {
      throw new ValidationError(
        'Invalid operation',
        `Cannot delete order with status '${order.status}'. Order must be cancelled or refunded first.`
      );
    }

    // ========================================================================
    // STEP 4: DELETE ORDER
    // ========================================================================

    await OrderModel.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error deleting Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
