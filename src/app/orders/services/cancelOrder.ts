/**
 * Cancel Order Service
 * Cancels an order with reason tracking
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, OrderStatus } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Input for cancelling an order
 */
export interface CancelOrderInput {
  /** Reason for cancellation */
  reason: string;
  /** User who cancelled the order */
  cancelledBy?: string;
}

/**
 * Cancel an order
 *
 * @param id - Order MongoDB _id
 * @param input - Cancellation data
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails or order cannot be cancelled
 *
 * @example
 * ```typescript
 * const cancelledOrder = await cancelOrder('507f1f77bcf86cd799439011', {
 *   reason: 'Customer requested cancellation',
 *   cancelledBy: 'user-uuid'
 * });
 * ```
 */
export const cancelOrder = async (
  id: string,
  input: CancelOrderInput
): Promise<ApiResponse<IOrderDocument>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE INPUTS
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

    if (!input.reason) {
      throw new ValidationError('Validation failed', 'Cancellation reason is required');
    }

    // ========================================================================
    // STEP 2: FIND ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE ORDER CAN BE CANCELLED
    // ========================================================================

    if (!order.canTransitionTo(OrderStatus.CANCELLED)) {
      throw new ValidationError(
        'Invalid operation',
        `Cannot cancel order with status '${order.status}'`
      );
    }

    // ========================================================================
    // STEP 4: CANCEL ORDER
    // ========================================================================

    order.cancellationReason = input.reason;
    order.updateStatus(OrderStatus.CANCELLED, input.reason, input.cancelledBy);
    await order.save();

    return {
      success: true,
      data: order,
      message: 'Order cancelled successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error cancelling Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
