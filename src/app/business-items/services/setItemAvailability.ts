/**
 * Set Item Availability Service
 * Updates the availability status of a business item
 */

import type { UpdateOptions } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { updateBusinessItem } from './updateBusinessItem.js';
import { validateUuid } from '../utils/validation.js';

/**
 * Options for availability update operation
 */
type SetAvailabilityOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Set item availability status
 *
 * @param itemId - Business item ID
 * @param available - Whether the item should be available
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 * @throws {NotFoundError} When item is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * // Make item unavailable
 * const item = await setItemAvailability('item-uuid', false);
 * console.log(item.data.available); // false
 * ```
 */
export const setItemAvailability = async (
  itemId: string,
  available: boolean,
  options?: SetAvailabilityOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  try {
    // Validate item ID
    if (!itemId || typeof itemId !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'Item ID is required and must be a string'
      );
    }

    validateUuid(itemId, 'Item ID');

    // Validate available parameter
    if (typeof available !== 'boolean') {
      throw new ValidationError(
        'Validation failed',
        'Availability must be a boolean value'
      );
    }

    // Fetch current record
    const item = await BusinessItemModel.findByPk(itemId, {
      transaction: options?.transaction,
    });

    if (!item) {
      throw new NotFoundError(`Business item with ID ${itemId} not found`);
    }

    // Check if already in desired state
    if (item.available === available) {
      return {
        success: true,
        data: item,
        message: `Item is already ${available ? 'available' : 'unavailable'}`,
      };
    }

    // Update availability
    const updatedItem = await updateBusinessItem(
      itemId,
      { available },
      options
    );

    return {
      ...updatedItem,
      message: `Item ${available ? 'made available' : 'made unavailable'} successfully`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating item availability',
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Mark an item as available
 *
 * @param itemId - Business item ID
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 */
export const makeItemAvailable = async (
  itemId: string,
  options?: SetAvailabilityOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  return setItemAvailability(itemId, true, options);
};

/**
 * Mark an item as unavailable
 *
 * @param itemId - Business item ID
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 */
export const makeItemUnavailable = async (
  itemId: string,
  options?: SetAvailabilityOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  return setItemAvailability(itemId, false, options);
};
