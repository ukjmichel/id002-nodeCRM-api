/**
 * Delete Business Item Service
 * Deletes a business item record by ID with validation
 */

import type { DestroyOptions } from 'sequelize';
import { ItemModel } from '../models/item.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../utils/validation.js';

/**
 * Options for delete operation
 */
type DeleteItemOptions = Pick<
  DestroyOptions<any>,
  'transaction' | 'force'
>;

/**
 * Delete a business item by ID
 *
 * @param id - Business item ID
 * @param options - Destroy options (transaction support)
 * @returns Deletion confirmation
 * @throws {NotFoundError} When business item is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * await deleteItem('item-uuid-here');
 * ```
 */
export const deleteItem = async (
  id: string,
  options?: DeleteItemOptions
): Promise<ApiResponse<void>> => {
  try {
    // ========================================================================
    // STEP 1: ID VALIDATION
    // ========================================================================

    if (!id) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }

    validateUuid(id, 'Item ID');

    // ========================================================================
    // STEP 2: FETCH CURRENT RECORD (DATABASE CHECK)
    // ========================================================================

    const record = await ItemModel.findByPk(id, {
      transaction: options?.transaction,
    });

    if (!record) {
      throw new NotFoundError(`Business item with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: CHECK FOR RELATED RECORDS (BUSINESS RULES)
    // ========================================================================

    // Example: Check if item is part of any active orders
    // const activeOrders = await OrderItemModel.count({
    //   where: { itemId: record.itemId, status: { [Op.in]: ['pending', 'processing'] } },
    //   transaction: options?.transaction,
    // });
    //
    // if (activeOrders > 0) {
    //   throw new ValidationError(
    //     'Cannot delete item',
    //     `This item has ${activeOrders} active order(s) and cannot be deleted`
    //   );
    // }

    // Example: Check if item is in any cart
    // const cartsWithItem = await CartItemModel.count({
    //   where: { itemId: record.itemId },
    //   transaction: options?.transaction,
    // });
    //
    // if (cartsWithItem > 0) {
    //   // Optionally warn or proceed
    // }

    // ========================================================================
    // STEP 4: DATABASE DELETE OPERATION
    // ========================================================================

    await record.destroy({
      transaction: options?.transaction,
      force: options?.force,
    });

    return {
      success: true,
      message: 'Business item deleted successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.name === 'SequelizeForeignKeyConstraintError'
    ) {
      throw new ValidationError(
        'Cannot delete item',
        'This item is referenced by other records and cannot be deleted. Consider marking it as unavailable instead.'
      );
    }

    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError(
        'Validation failed for Business Item',
        error.message
      );
    }

    if (error instanceof Error && error.name === 'SequelizeConnectionError') {
      throw new ValidationError(
        'Database connection error',
        'Unable to connect to database. Please try again later.'
      );
    }

    if (error instanceof Error && error.name === 'SequelizeTimeoutError') {
      throw new ValidationError(
        'Database timeout',
        'Database operation took too long. Please try again.'
      );
    }

    throw new ValidationError(
      'Error deleting Business Item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
