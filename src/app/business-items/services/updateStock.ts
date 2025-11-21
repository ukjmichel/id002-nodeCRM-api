/**
 * Update Stock Service
 * Updates the stock quantity of a business item
 */

import type { UpdateOptions } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessItemModel } from '../models/business-item.model.js';
import { updateBusinessItem } from './updateBusinessItem.js';
import { validateUuid, validateQuantity } from '../utils/validation.js';

/**
 * Options for stock update operation
 */
type UpdateStockOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Update item stock quantity
 *
 * @param itemId - Business item ID
 * @param quantity - New stock quantity
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 * @throws {NotFoundError} When item is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const item = await updateStock('item-uuid', 100);
 * console.log(item.data.stockQuantity); // 100
 * ```
 */
export const updateStock = async (
  itemId: string,
  quantity: number,
  options?: UpdateStockOptions
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

    // Validate quantity
    validateQuantity(quantity, 'Stock quantity', 0);

    // Fetch current record
    const item = await BusinessItemModel.findByPk(itemId, {
      transaction: options?.transaction,
    });

    if (!item) {
      throw new NotFoundError(`Business item with ID ${itemId} not found`);
    }

    // Update stock
    const updatedItem = await updateBusinessItem(
      itemId,
      { stockQuantity: quantity },
      options
    );

    return {
      ...updatedItem,
      message: 'Stock updated successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error updating stock',
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Increment item stock by a quantity
 *
 * @param itemId - Business item ID
 * @param increment - Quantity to add
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 */
export const incrementStock = async (
  itemId: string,
  increment: number,
  options?: UpdateStockOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  try {
    validateUuid(itemId, 'Item ID');

    if (increment <= 0) {
      throw new ValidationError(
        'Validation failed',
        'Increment must be a positive number'
      );
    }

    const item = await BusinessItemModel.findByPk(itemId, {
      transaction: options?.transaction,
    });

    if (!item) {
      throw new NotFoundError(`Business item with ID ${itemId} not found`);
    }

    const currentStock = item.stockQuantity ?? 0;
    const newStock = currentStock + increment;

    return updateStock(itemId, newStock, options);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error incrementing stock',
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Decrement item stock by a quantity
 *
 * @param itemId - Business item ID
 * @param decrement - Quantity to subtract
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 * @throws {ValidationError} When decrement would result in negative stock
 */
export const decrementStock = async (
  itemId: string,
  decrement: number,
  options?: UpdateStockOptions
): Promise<ApiResponse<BusinessItemModel>> => {
  try {
    validateUuid(itemId, 'Item ID');

    if (decrement <= 0) {
      throw new ValidationError(
        'Validation failed',
        'Decrement must be a positive number'
      );
    }

    const item = await BusinessItemModel.findByPk(itemId, {
      transaction: options?.transaction,
    });

    if (!item) {
      throw new NotFoundError(`Business item with ID ${itemId} not found`);
    }

    const currentStock = item.stockQuantity ?? 0;
    const newStock = currentStock - decrement;

    if (newStock < 0) {
      throw new ValidationError(
        'Insufficient stock',
        `Cannot decrement by ${decrement}. Current stock is ${currentStock}`
      );
    }

    return updateStock(itemId, newStock, options);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error decrementing stock',
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Find items with low stock
 *
 * @param businessId - Optional business ID to filter by
 * @param options - Query options
 * @returns Array of items with low stock
 */
export const findLowStockItems = async (
  businessId?: string,
  options?: UpdateStockOptions
): Promise<ApiResponse<BusinessItemModel[]>> => {
  try {
    const { Op } = await import('sequelize');

    const where: any = {
      stockQuantity: { [Op.not]: null },
      lowStockThreshold: { [Op.not]: null },
    };

    if (businessId) {
      where.businessId = businessId;
    }

    const items = await BusinessItemModel.findAll({
      where: {
        ...where,
        [Op.and]: [
          {
            stockQuantity: {
              [Op.lte]: BusinessItemModel.sequelize?.col('lowStockThreshold'),
            },
          },
        ],
      },
      transaction: options?.transaction,
      order: [['stockQuantity', 'ASC']],
    });

    // Fallback: filter in application if col comparison doesn't work
    const lowStockItems = items.filter(
      (item) =>
        item.stockQuantity !== null &&
        item.stockQuantity !== undefined &&
        item.lowStockThreshold !== null &&
        item.lowStockThreshold !== undefined &&
        item.stockQuantity <= item.lowStockThreshold
    );

    return {
      success: true,
      data: lowStockItems,
      count: lowStockItems.length,
      message:
        lowStockItems.length === 0
          ? 'No items with low stock'
          : `Found ${lowStockItems.length} item(s) with low stock`,
    };
  } catch (error) {
    throw new ValidationError(
      'Error finding low stock items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
