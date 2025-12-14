/**
 * Update Order Item Quantity Service
 * Updates the quantity of an item in an order
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, OrderStatus } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Update the quantity of an item in an order
 *
 * @param id - Order MongoDB _id
 * @param itemId - Item ID to update
 * @param quantity - New quantity
 * @returns Updated order record
 * @throws {NotFoundError} When order or item is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedOrder = await updateOrderItemQuantity(
 *   '507f1f77bcf86cd799439011',
 *   'item-uuid',
 *   3
 * );
 * ```
 */
export const updateOrderItemQuantity = async (
  id: string,
  itemId: string,
  quantity: number
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

    if (!itemId) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }
    validateUuid(itemId, 'Item ID');

    if (quantity === undefined || quantity < 1) {
      throw new ValidationError('Validation failed', 'Quantity must be at least 1');
    }

    if (quantity > 100) {
      throw new ValidationError('Validation failed', 'Quantity cannot exceed 100');
    }

    // ========================================================================
    // STEP 2: FIND ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE ORDER CAN BE MODIFIED
    // ========================================================================

    const modifiableStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED];

    if (!modifiableStatuses.includes(order.status as OrderStatus)) {
      throw new ValidationError(
        'Invalid operation',
        `Cannot modify order with status '${order.status}'`
      );
    }

    // ========================================================================
    // STEP 4: UPDATE QUANTITY
    // ========================================================================

    const updated = order.updateItemQuantity(itemId, quantity);

    if (!updated) {
      throw new NotFoundError(`Item ${itemId} not found in this order`);
    }

    order.recalculatePrices();
    await order.save();

    return {
      success: true,
      data: order,
      message: 'Item quantity updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating item quantity',
      error instanceof Error ? error.message : String(error)
    );
  }
};
