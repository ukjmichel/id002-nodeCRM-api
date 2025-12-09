/**
 * Assign Driver Service
 * Assigns a driver to an order for delivery
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import {
  IOrderDocument,
  FulfillmentType,
  FulfillmentStatus,
} from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Input for assigning a driver
 */
export interface AssignDriverInput {
  /** Driver ID */
  driverId: string;
  /** Driver name */
  driverName: string;
  /** Driver phone (optional) */
  driverPhone?: string;
}

/**
 * Assign a driver to an order
 *
 * @param id - Order MongoDB _id
 * @param input - Driver assignment data
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedOrder = await assignDriver('507f1f77bcf86cd799439011', {
 *   driverId: 'driver-123',
 *   driverName: 'John Driver',
 *   driverPhone: '+33612345678'
 * });
 * ```
 */
export const assignDriver = async (
  id: string,
  input: AssignDriverInput
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

    if (!input.driverId) {
      throw new ValidationError('Validation failed', 'Driver ID is required');
    }

    if (!input.driverName) {
      throw new ValidationError('Validation failed', 'Driver name is required');
    }

    // ========================================================================
    // STEP 2: FIND ORDER
    // ========================================================================

    const order = await OrderModel.findById(id);

    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE ORDER CAN HAVE DRIVER
    // ========================================================================

    if (order.fulfillmentType !== FulfillmentType.DELIVERY) {
      throw new ValidationError(
        'Invalid operation',
        'Can only assign driver to delivery orders'
      );
    }

    if (order.fulfillmentStatus !== FulfillmentStatus.PENDING) {
      throw new ValidationError(
        'Invalid operation',
        `Cannot assign driver when fulfillment status is '${order.fulfillmentStatus}'`
      );
    }

    // ========================================================================
    // STEP 4: ASSIGN DRIVER
    // ========================================================================

    order.assignDriver(input.driverId, input.driverName, input.driverPhone);
    await order.save();

    return {
      success: true,
      data: order,
      message: `Driver '${input.driverName}' assigned to order`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error assigning driver',
      error instanceof Error ? error.message : String(error)
    );
  }
};
