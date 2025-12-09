/**
 * Refund Order Service
 * Processes a refund for an order
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import {
  IOrderDocument,
  OrderStatus,
  PaymentStatus,
} from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Input for refunding an order
 */
export interface RefundOrderInput {
  /** Refund amount */
  amount: number;
  /** Reason for refund */
  reason: string;
  /** User who processed the refund */
  refundedBy?: string;
}

/**
 * Refund an order
 *
 * @param id - Order MongoDB _id
 * @param input - Refund data
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails or order cannot be refunded
 *
 * @example
 * ```typescript
 * const refundedOrder = await refundOrder('507f1f77bcf86cd799439011', {
 *   amount: 25.99,
 *   reason: 'Item was not as described',
 *   refundedBy: 'admin-uuid'
 * });
 * ```
 */
export const refundOrder = async (
  id: string,
  input: RefundOrderInput
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

    if (input.amount === undefined || input.amount <= 0) {
      throw new ValidationError(
        'Validation failed',
        'Refund amount must be greater than 0'
      );
    }

    if (!input.reason) {
      throw new ValidationError('Validation failed', 'Refund reason is required');
    }

    // ========================================================================
    // STEP 2: FIND ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE ORDER CAN BE REFUNDED
    // ========================================================================

    // Check if order was paid
    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new ValidationError(
        'Invalid operation',
        `Cannot refund order with payment status '${order.paymentStatus}'`
      );
    }

    // Check if refund amount is valid
    const alreadyRefunded = order.refundAmount || 0;
    const maxRefundable = order.totalAmount - alreadyRefunded;

    if (input.amount > maxRefundable) {
      throw new ValidationError(
        'Invalid operation',
        `Refund amount (${input.amount}) exceeds maximum refundable amount (${maxRefundable})`
      );
    }

    // ========================================================================
    // STEP 4: PROCESS REFUND
    // ========================================================================

    order.markAsRefunded(alreadyRefunded + input.amount, input.reason);
    await order.save();

    const isFullRefund = alreadyRefunded + input.amount >= order.totalAmount;

    return {
      success: true,
      data: order,
      message: isFullRefund
        ? 'Order fully refunded'
        : `Order partially refunded (${input.amount})`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error refunding Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
