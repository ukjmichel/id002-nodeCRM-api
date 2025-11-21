/**
 * Set Item Featured Service
 * Updates the featured status of a business item
 */

import type { UpdateOptions } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { updateBusinessItem } from './updateBusinessItem.js';
import { validateUuid } from '../utils/validation.js';

/**
 * Options for featured update operation
 */
type SetFeaturedOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Set item featured status
 *
 * @param itemId - Business item ID
 * @param featured - Whether the item should be featured
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 * @throws {NotFoundError} When item is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * // Feature an item
 * const item = await setItemFeatured('item-uuid', true);
 * console.log(item.data.featured); // true
 * ```
 */
export const setItemFeatured = async (
  itemId: string,
  featured: boolean,
  options?: SetFeaturedOptions
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

    // Validate featured parameter
    if (typeof featured !== 'boolean') {
      throw new ValidationError(
        'Validation failed',
        'Featured must be a boolean value'
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
    if (item.featured === featured) {
      return {
        success: true,
        data: item,
        message: `Item is already ${featured ? 'featured' : 'not featured'}`,
      };
    }

    // Update featured status
    const updatedItem = await updateBusinessItem(
      itemId,
      { featured },
      options
    );

    return {
      ...updatedItem,
      message: `Item ${featured ? 'featured' : 'unfeatured'} successfully`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating item featured status',
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Feature an item
 *
 * @param itemId - Business item ID
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 */
export const featureItem = async (
  itemId: string,
  options?: SetFeaturedOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  return setItemFeatured(itemId, true, options);
};

/**
 * Unfeature an item
 *
 * @param itemId - Business item ID
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 */
export const unfeatureItem = async (
  itemId: string,
  options?: SetFeaturedOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  return setItemFeatured(itemId, false, options);
};
