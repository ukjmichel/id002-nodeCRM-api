/**
 * Update Driver Location Service
 * Updates the current location of the driver for an order
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
 * Input for updating driver location
 */
export interface UpdateDriverLocationInput {
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
}

/**
 * Update driver location for an order
 *
 * @param id - Order MongoDB _id
 * @param input - Location data
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const updatedOrder = await updateDriverLocation('507f1f77bcf86cd799439011', {
 *   latitude: 48.8566,
 *   longitude: 2.3522
 * });
 * ```
 */
export const updateDriverLocation = async (
  id: string,
  input: UpdateDriverLocationInput
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

    if (input.latitude === undefined || input.longitude === undefined) {
      throw new ValidationError(
        'Validation failed',
        'Latitude and longitude are required'
      );
    }

    if (input.latitude < -90 || input.latitude > 90) {
      throw new ValidationError(
        'Validation failed',
        'Latitude must be between -90 and 90'
      );
    }

    if (input.longitude < -180 || input.longitude > 180) {
      throw new ValidationError(
        'Validation failed',
        'Longitude must be between -180 and 180'
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
    // STEP 3: VALIDATE ORDER HAS DRIVER
    // ========================================================================

    if (order.fulfillmentType !== FulfillmentType.DELIVERY) {
      throw new ValidationError(
        'Invalid operation',
        'Can only update driver location for delivery orders'
      );
    }

    if (!order.driverId) {
      throw new ValidationError(
        'Invalid operation',
        'No driver assigned to this order'
      );
    }

    // Check if order is in an active delivery status
    const activeStatuses = [
      FulfillmentStatus.ASSIGNED,
      FulfillmentStatus.PICKED_UP,
      FulfillmentStatus.IN_TRANSIT,
      FulfillmentStatus.ARRIVED,
    ];

    if (!activeStatuses.includes(order.fulfillmentStatus as FulfillmentStatus)) {
      throw new ValidationError(
        'Invalid operation',
        `Cannot update driver location when fulfillment status is '${order.fulfillmentStatus}'`
      );
    }

    // ========================================================================
    // STEP 4: UPDATE LOCATION
    // ========================================================================

    order.updateDriverLocation(input.latitude, input.longitude);
    await order.save();

    return {
      success: true,
      data: order,
      message: 'Driver location updated',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating driver location',
      error instanceof Error ? error.message : String(error)
    );
  }
};
