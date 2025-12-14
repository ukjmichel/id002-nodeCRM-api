/**
 * Add Item To Order Service
 * Adds an item to an existing order
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/uuidValidator.js';
import { OrderModel } from '../models/order.model.js';
import {
  IOrderDocument,
  IOrderItem,
  OrderStatus,
  AddOrderItemInput,
} from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Add an item to an existing order
 *
 * @param id - Order MongoDB _id
 * @param input - Item data to add
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedOrder = await addItemToOrder('507f1f77bcf86cd799439011', {
 *   itemId: 'item-uuid',
 *   name: 'Extra Pizza',
 *   quantity: 1,
 *   unitPrice: 12.99
 * });
 * ```
 */
export const addItemToOrder = async (
  id: string,
  input: AddOrderItemInput
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

    if (!input.itemId) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }
    validateUuid(input.itemId, 'Item ID');

    if (!input.name) {
      throw new ValidationError('Validation failed', 'Item name is required');
    }

    if (!input.quantity || input.quantity < 1) {
      throw new ValidationError('Validation failed', 'Quantity must be at least 1');
    }

    if (input.unitPrice === undefined || input.unitPrice < 0) {
      throw new ValidationError('Validation failed', 'Unit price must be a positive number');
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
    // STEP 4: ADD ITEM
    // ========================================================================

    const optionsPrice = (input.options || []).reduce(
      (sum, opt) => sum + (opt.additionalPrice || 0),
      0
    );

    const newItem: IOrderItem = {
      itemId: input.itemId,
      name: input.name,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      totalPrice: (input.unitPrice + optionsPrice) * input.quantity,
      options: input.options || [],
      specialInstructions: input.specialInstructions,
    };

    order.addItem(newItem);
    order.recalculatePrices();
    await order.save();

    return {
      success: true,
      data: order,
      message: 'Item added to order successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error adding item to Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
