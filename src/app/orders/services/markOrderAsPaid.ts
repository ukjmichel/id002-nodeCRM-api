/**
 * Mark Order As Paid Service
 * Marks an order as paid with optional transaction ID
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, PaymentStatus } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Input for marking order as paid
 */
export interface MarkOrderAsPaidInput {
  /** Payment transaction ID (optional) */
  transactionId?: string;
}

/**
 * Mark an order as paid
 *
 * @param id - Order MongoDB _id
 * @param input - Payment data (optional)
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails or order cannot be marked as paid
 *
 * @example
 * ```typescript
 * const paidOrder = await markOrderAsPaid('507f1f77bcf86cd799439011', {
 *   transactionId: 'txn_123456789'
 * });
 * ```
 */
export const markOrderAsPaid = async (
  id: string,
  input: MarkOrderAsPaidInput = {}
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

    // ========================================================================
    // STEP 2: FIND ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE ORDER CAN BE MARKED AS PAID
    // ========================================================================

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new ValidationError(
        'Invalid operation',
        'Order is already marked as paid'
      );
    }

    if (order.paymentStatus === PaymentStatus.REFUNDED) {
      throw new ValidationError(
        'Invalid operation',
        'Cannot mark a refunded order as paid'
      );
    }

    // ========================================================================
    // STEP 4: MARK AS PAID
    // ========================================================================

    order.markAsPaid(input.transactionId);
    await order.save();

    return {
      success: true,
      data: order,
      message: 'Order marked as paid',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error marking Order as paid',
      error instanceof Error ? error.message : String(error)
    );
  }
};
