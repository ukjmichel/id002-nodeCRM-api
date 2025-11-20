/**
 * Delete Business Service
 * Deletes a business record by ID with validation
 */

import type { DestroyOptions } from 'sequelize';
import { BusinessModel } from '../models/business.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { validateUuid } from '../utils/duplicateValidation.js';

/**
 * Options for delete operation
 * Extends Sequelize DestroyOptions to ensure type compatibility
 */
type DeleteBusinessOptions = Pick<DestroyOptions<any>, 'transaction' | 'force'>;

/**
 * Delete a business by ID
 *
 * @param id - Business ID
 * @param options - Destroy options (transaction support)
 * @returns Deletion confirmation
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When deletion fails
 *
 * @example
 * ```typescript
 * await deleteBusiness('business-uuid-here');
 * ```
 */
export const deleteBusiness = async (
  id: number | string,
  options?: DeleteBusinessOptions
): Promise<ApiResponse<void>> => {
  try {
    // ========================================================================
    // STEP 1: ID VALIDATION
    // ========================================================================

    // Validate ID is provided
    if (!id) {
      throw new ValidationError('Validation failed', 'Business ID is required');
    }

    // If string ID, validate UUID format
    if (typeof id === 'string') {
      validateUuid(id, 'Business ID');
    }

    // ========================================================================
    // STEP 2: FETCH CURRENT RECORD (DATABASE CHECK)
    // ========================================================================

    const record = await BusinessModel.findByPk(id, {
      transaction: options?.transaction,
    });

    if (!record) {
      throw new NotFoundError(`Business with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: CHECK FOR RELATED RECORDS (BUSINESS RULES)
    // ========================================================================

    // Example: Prevent deletion if business has active contracts
    // const activeContracts = await ContractModel.count({
    //   where: { businessId: record.businessId, status: 'active' },
    //   transaction: options?.transaction,
    // });
    //
    // if (activeContracts > 0) {
    //   throw new ValidationError(
    //     'Cannot delete business',
    //     `This business has ${activeContracts} active contract(s) and cannot be deleted`
    //   );
    // }

    // Example: Prevent deletion if business has pending invoices
    // const pendingInvoices = await InvoiceModel.count({
    //   where: { businessId: record.businessId, status: 'pending' },
    //   transaction: options?.transaction,
    // });
    //
    // if (pendingInvoices > 0) {
    //   throw new ValidationError(
    //     'Cannot delete business',
    //     `This business has ${pendingInvoices} pending invoice(s) and cannot be deleted`
    //   );
    // }

    // Example: Prevent deletion if business has transactions
    // const transactionCount = await TransactionModel.count({
    //   where: { businessId: record.businessId },
    //   transaction: options?.transaction,
    // });
    //
    // if (transactionCount > 0) {
    //   throw new ValidationError(
    //     'Cannot delete business',
    //     `This business has ${transactionCount} transaction(s) and cannot be deleted. Consider deactivating instead.`
    //   );
    // }

    // Example: Check if business has any employees
    // const employeeCount = await EmployeeModel.count({
    //   where: { businessId: record.businessId },
    //   transaction: options?.transaction,
    // });
    //
    // if (employeeCount > 0) {
    //   throw new ValidationError(
    //     'Cannot delete business',
    //     `This business has ${employeeCount} employee(s) and cannot be deleted`
    //   );
    // }

    // ========================================================================
    // STEP 4: VALIDATE DELETION ELIGIBILITY
    // ========================================================================

    // Optional: Only allow deletion of inactive businesses
    // if (record.active) {
    //   throw new ValidationError(
    //     'Cannot delete business',
    //     'Only inactive businesses can be deleted. Please deactivate the business first.'
    //   );
    // }

    // Optional: Only allow deletion of recently created businesses (within 30 days)
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // if (record.createdAt < thirtyDaysAgo) {
    //   throw new ValidationError(
    //     'Cannot delete business',
    //     'Only businesses created within the last 30 days can be deleted'
    //   );
    // }

    // ========================================================================
    // STEP 5: DATABASE DELETE OPERATION
    // ========================================================================

    await record.destroy({
      transaction: options?.transaction,
      force: options?.force, // For soft delete models, use force: true for hard delete
    });

    return {
      success: true,
      message: 'Business deleted successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    // Handle foreign key constraint errors (if other tables reference this business)
    if (
      error instanceof Error &&
      error.name === 'SequelizeForeignKeyConstraintError'
    ) {
      throw new ValidationError(
        'Cannot delete business',
        'This business is referenced by other records and cannot be deleted. Consider deactivating instead.'
      );
    }

    // Handle Sequelize validation errors
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError(
        'Validation failed for Business',
        error.message
      );
    }

    // Handle database connection errors
    if (error instanceof Error && error.name === 'SequelizeConnectionError') {
      throw new ValidationError(
        'Database connection error',
        'Unable to connect to database. Please try again later.'
      );
    }

    // Handle timeout errors
    if (error instanceof Error && error.name === 'SequelizeTimeoutError') {
      throw new ValidationError(
        'Database timeout',
        'Database operation took too long. Please try again.'
      );
    }

    throw new ValidationError(
      'Error deleting Business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
