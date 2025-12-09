/**
 * Remove Item From Order Service
 * Removes an item from an existing order
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, OrderStatus } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Remove an item from an existing order
 *
 * @param id - Order MongoDB _id
 * @param itemId - Item ID to remove
 * @returns Updated order record
 * @throws {NotFoundError} When order or item is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedOrder = await removeItemFromOrder(
 *   '507f1f77bcf86cd799439011',
 *   'item-uuid'
 * );
 * ```
 */
export const removeItemFromOrder = async (
  id: string,
  itemId: string
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
    // STEP 4: CHECK ITEM EXISTS
    // ========================================================================

    const item = order.getItem(itemId);

    if (!item) {
      throw new NotFoundError(`Item ${itemId} not found in this order`);
    }

    // ========================================================================
    // STEP 5: VALIDATE ORDER WON'T BE EMPTY
    // ========================================================================

    if (order.getItemCount() <= 1) {
      throw new ValidationError(
        'Invalid operation',
        'Cannot remove the last item from an order. Cancel the order instead.'
      );
    }

    // ========================================================================
    // STEP 6: REMOVE ITEM
    // ========================================================================

    order.removeItem(itemId);
    order.recalculatePrices();
    await order.save();

    return {
      success: true,
      data: order,
      message: 'Item removed from order successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error removing item from Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
