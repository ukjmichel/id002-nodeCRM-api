/**
 * Update Order Service
 * Updates an existing order record
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, UpdateOrderInput } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Update an order by MongoDB _id
 *
 * @param id - Order MongoDB _id
 * @param data - Data to update
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedOrder = await updateOrder('507f1f77bcf86cd799439011', {
 *   specialInstructions: 'Please ring the doorbell twice',
 *   internalNotes: 'VIP customer'
 * });
 * ```
 */
export const updateOrder = async (
  id: string,
  data: UpdateOrderInput
): Promise<ApiResponse<IOrderDocument>> => {
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
    // STEP 2: FIND EXISTING ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: UPDATE FIELDS
    // ========================================================================

    if (data.deliveryAddress !== undefined) {
      order.deliveryAddress = data.deliveryAddress;
    }

    if (data.scheduledAt !== undefined) {
      order.scheduledAt = data.scheduledAt;
    }

    if (data.estimatedAt !== undefined) {
      order.estimatedAt = data.estimatedAt;
    }

    if (data.specialInstructions !== undefined) {
      order.specialInstructions = data.specialInstructions;
    }

    if (data.internalNotes !== undefined) {
      order.internalNotes = data.internalNotes;
    }

    if (data.tipAmount !== undefined) {
      order.tipAmount = data.tipAmount;
      order.recalculatePrices();
    }

    await order.save();

    return {
      success: true,
      data: order,
      message: 'Order updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      throw new ValidationError('Validation failed', error.message);
    }

    throw new ValidationError(
      'Error updating Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
