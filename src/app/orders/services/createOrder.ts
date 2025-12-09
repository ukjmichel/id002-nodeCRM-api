/**
 * Create Order Service
 * Creates a new order record with validation
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../../../core/utils/index.js';
import { OrderModel } from '../models/order.model.js';
import {
  IOrderDocument,
  CreateOrderInput,
  FulfillmentType,
  OrderStatus,
  FulfillmentStatus,
  PaymentStatus,
} from '../interfaces/order.interface.js';

/**
 * Create a new order
 *
 * @param data - Order data to create
 * @returns Created order record
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const newOrder = await createOrder({
 *   userId: 'user-uuid',
 *   businessId: 'business-uuid',
 *   items: [{ itemId: 'item-uuid', name: 'Pizza', quantity: 2, unitPrice: 12.99 }],
 *   fulfillmentType: FulfillmentType.DELIVERY,
 *   deliveryAddress: { street: '123 Main St', city: 'Paris', postalCode: '75001', country: 'FR' },
 *   paymentMethod: PaymentMethod.CARD,
 *   customerPhone: '+33612345678',
 *   customerName: 'John Doe'
 * });
 * ```
 */
export const createOrder = async (
  data: CreateOrderInput
): Promise<ApiResponse<IOrderDocument>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE REQUIRED FIELDS
    // ========================================================================

    if (!data.userId) {
      throw new ValidationError('Validation failed', 'User ID is required');
    }
    validateUuid(data.userId, 'User ID');

    if (!data.businessId) {
      throw new ValidationError('Validation failed', 'Business ID is required');
    }
    validateUuid(data.businessId, 'Business ID');

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new ValidationError('Validation failed', 'At least one item is required');
    }

    if (!data.fulfillmentType) {
      throw new ValidationError('Validation failed', 'Fulfillment type is required');
    }

    if (!data.paymentMethod) {
      throw new ValidationError('Validation failed', 'Payment method is required');
    }

    if (!data.customerPhone) {
      throw new ValidationError('Validation failed', 'Customer phone is required');
    }

    if (!data.customerName) {
      throw new ValidationError('Validation failed', 'Customer name is required');
    }

    // Validate delivery address for delivery orders
    if (data.fulfillmentType === FulfillmentType.DELIVERY) {
      if (!data.deliveryAddress) {
        throw new ValidationError(
          'Validation failed',
          'Delivery address is required for delivery orders'
        );
      }
    }

    // Validate item IDs
    for (const item of data.items) {
      if (!item.itemId) {
        throw new ValidationError('Validation failed', 'Each item must have an itemId');
      }
      validateUuid(item.itemId, 'Item ID');

      if (!item.name) {
        throw new ValidationError('Validation failed', 'Each item must have a name');
      }

      if (!item.quantity || item.quantity < 1) {
        throw new ValidationError('Validation failed', 'Each item must have a quantity of at least 1');
      }

      if (item.unitPrice === undefined || item.unitPrice < 0) {
        throw new ValidationError('Validation failed', 'Each item must have a valid unit price');
      }
    }

    // ========================================================================
    // STEP 2: PREPARE ORDER DATA
    // ========================================================================

    // Calculate item totals
    const itemsWithTotals = data.items.map((item) => {
      const optionsPrice = (item.options || []).reduce(
        (sum, opt) => sum + (opt.additionalPrice || 0),
        0
      );
      return {
        ...item,
        options: item.options || [],
        totalPrice: (item.unitPrice + optionsPrice) * item.quantity,
      };
    });

    // Calculate subtotal
    const subtotal = itemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0);

    // ========================================================================
    // STEP 3: CREATE ORDER
    // ========================================================================

    const order = new OrderModel({
      userId: data.userId,
      businessId: data.businessId,
      items: itemsWithTotals,
      fulfillmentType: data.fulfillmentType,
      deliveryAddress: data.deliveryAddress,
      scheduledAt: data.scheduledAt,
      paymentMethod: data.paymentMethod,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      specialInstructions: data.specialInstructions,
      discountCode: data.discountCode,
      tipAmount: data.tipAmount || 0,
      subtotal,
      taxRate: 0, // Will be set based on business settings
      taxAmount: 0,
      deliveryFee: data.fulfillmentType === FulfillmentType.DELIVERY ? 0 : 0, // Will be calculated
      serviceFee: 0,
      discountAmount: 0,
      totalAmount: subtotal + (data.tipAmount || 0),
      status: OrderStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    await order.save();

    return {
      success: true,
      data: order,
      message: 'Order created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      throw new ValidationError('Validation failed', error.message);
    }

    throw new ValidationError(
      'Error creating Order',
      error instanceof Error ? error.message : String(error)
    );
  }
};
