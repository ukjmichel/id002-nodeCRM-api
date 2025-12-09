/**
 * Update Fulfillment Status Service
 * Updates the fulfillment status of an order with history tracking
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { IOrderDocument, FulfillmentStatus } from '../interfaces/order.interface.js';

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Input for updating fulfillment status
 */
export interface UpdateFulfillmentStatusInput {
  /** New fulfillment status */
  status: FulfillmentStatus;
  /** Optional note about the status change */
  note?: string;
  /** Driver ID (if applicable) */
  driverId?: string;
  /** Location at time of status change */
  location?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Update fulfillment status with history tracking
 *
 * @param id - Order MongoDB _id
 * @param input - Fulfillment status update data
 * @returns Updated order record
 * @throws {NotFoundError} When order is not found
 * @throws {ValidationError} When validation fails or transition is invalid
 *
 * @example
 * ```typescript
 * const updatedOrder = await updateFulfillmentStatus('507f1f77bcf86cd799439011', {
 *   status: FulfillmentStatus.PICKED_UP,
 *   note: 'Driver picked up the order',
 *   driverId: 'driver-123',
 *   location: { latitude: 48.8566, longitude: 2.3522 }
 * });
 * ```
 */
export const updateFulfillmentStatus = async (
  id: string,
  input: UpdateFulfillmentStatusInput
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
      throw new ValidationError('Validation failed', 'Fulfillment status is required');
    }

    if (!Object.values(FulfillmentStatus).includes(input.status)) {
      throw new ValidationError(
        'Validation failed',
        `Invalid fulfillment status. Must be one of: ${Object.values(FulfillmentStatus).join(', ')}`
      );
    }

    // Validate location if provided
    if (input.location) {
      if (
        input.location.latitude < -90 ||
        input.location.latitude > 90 ||
        input.location.longitude < -180 ||
        input.location.longitude > 180
      ) {
        throw new ValidationError('Validation failed', 'Invalid location coordinates');
      }
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

    if (!order.canTransitionFulfillmentTo(input.status)) {
      throw new ValidationError(
        'Invalid fulfillment status transition',
        `Cannot transition from '${order.fulfillmentStatus}' to '${input.status}'`
      );
    }

    // ========================================================================
    // STEP 4: UPDATE FULFILLMENT STATUS
    // ========================================================================

    order.updateFulfillmentStatus(
      input.status,
      input.note,
      input.driverId,
      input.location
    );

    await order.save();

    return {
      success: true,
      data: order,
      message: `Fulfillment status updated to '${input.status}'`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating fulfillment status',
      error instanceof Error ? error.message : String(error)
    );
  }
};
