/**
 * Update Order Status Service
 * Updates the status of an order with history tracking
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
 * Input for updating order status
 */
export interface UpdateOrderStatusInput {
  /** New status */
  status: OrderStatus;
  /** Optional note about the status change */
  note?: string;
  /** User who changed the status */
  changedBy?: string;
}

/**
 * Update order status with history tracking
 *
 * @param id - Order MongoDB _id
 * @param input - Status update data
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails or transition is invalid
 *
 * @example
 * ```typescript
 * const updatedOrder = await updateOrderStatus('507f1f77bcf86cd799439011', {
 *   status: OrderStatus.CONFIRMED,
 *   note: 'Order confirmed by restaurant',
 *   changedBy: 'staff-uuid'
 * });
 * ```
 */
export const updateOrderStatus = async (
  id: string,
  input: UpdateOrderStatusInput
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

    if (!input.status) {
      throw new ValidationError('Validation failed', 'Status is required');
    }

    if (!Object.values(OrderStatus).includes(input.status)) {
      throw new ValidationError(
        'Validation failed',
        `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}`
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
    // STEP 3: VALIDATE TRANSITION
    // ========================================================================

    if (!order.canTransitionTo(input.status)) {
      throw new ValidationError(
        'Invalid status transition',
        `Cannot transition from '${order.status}' to '${input.status}'`
      );
    }

    // ========================================================================
    // STEP 4: UPDATE STATUS
    // ========================================================================

    order.updateStatus(input.status, input.note, input.changedBy);
    await order.save();

    return {
      success: true,
      data: order,
      message: `Order status updated to '${input.status}'`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating Order status',
      error instanceof Error ? error.message : String(error)
    );
  }
};
