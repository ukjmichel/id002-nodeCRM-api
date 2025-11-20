/**
 * Deactivate Business Service
 * Marks a business as inactive with validation
 */

import type { UpdateOptions } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { updateBusiness } from './updateBusiness.js';
import { validateUuid } from '../utils/duplicateValidation.js';

/**
 * Options for deactivate operation
 * Extends Sequelize UpdateOptions to ensure type compatibility
 */
type DeactivateBusinessOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Mark a business as inactive
 * Sets the active flag to false and optionally sets closure date
 *
 * @param businessId - Business ID
 * @param closureDate - Optional closure date (defaults to today)
 * @param options - Update options (transaction support)
 * @returns Updated business record
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const inactiveBusiness = await deactivateBusiness('business-uuid-here');
 * console.log(inactiveBusiness.data.active); // false
 * ```
 */
export const deactivateBusiness = async (
  businessId: string,
  closureDate?: Date,
  options?: DeactivateBusinessOptions
): Promise<ApiResponse<BusinessModel>> => {
  try {
    // ========================================================================
    // STEP 1: ID VALIDATION
    // ========================================================================

    // Validate businessId format
    if (!businessId || typeof businessId !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'Business ID is required and must be a string'
      );
    }

    // UUID format validation
    validateUuid(businessId, 'Business ID');

    // ========================================================================
    // STEP 2: FETCH CURRENT RECORD (DATABASE CHECK)
    // ========================================================================

    const business = await BusinessModel.findByPk(businessId, {
      transaction: options?.transaction,
    });

    if (!business) {
      throw new NotFoundError(`Business with ID ${businessId} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE BUSINESS STATE
    // ========================================================================

    // Check if business is already inactive
    if (!business.active) {
      return {
        success: true,
        data: business,
        message: 'Business is already inactive',
      };
    }

    // ========================================================================
    // STEP 4: VALIDATE CLOSURE DATE
    // ========================================================================

    // Validate closure date if provided
    let finalClosureDate = closureDate || new Date();

    if (closureDate) {
      const closureDateObj = new Date(closureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if closure date is valid
      if (isNaN(closureDateObj.getTime())) {
        throw new ValidationError(
          'Validation failed',
          'Invalid closure date format'
        );
      }

      // Check if closure date is not in the future
      if (closureDateObj > today) {
        throw new ValidationError(
          'Validation failed',
          'Closure date cannot be in the future'
        );
      }

      // Check if closure date is not before creation date
      if (closureDateObj < business.createdAt) {
        throw new ValidationError(
          'Validation failed',
          'Closure date cannot be before business creation date'
        );
      }

      // Check if closure date is not before registration date (if exists)
      if (
        business.registrationDate &&
        closureDateObj < business.registrationDate
      ) {
        throw new ValidationError(
          'Validation failed',
          'Closure date cannot be before business registration date'
        );
      }

      finalClosureDate = closureDateObj;
    }

    // ========================================================================
    // STEP 5: CHECK FOR RELATED RECORDS (BUSINESS RULES)
    // ========================================================================

    // Example: Check for active contracts, pending orders, etc.
    // This is a placeholder - implement based on your business requirements

    // Optional: Check if there are any blocking conditions
    // const activeContracts = await ContractModel.count({
    //   where: { businessId: business.businessId, status: 'active' },
    //   transaction: options?.transaction,
    // });
    //
    // if (activeContracts > 0) {
    //   throw new ValidationError(
    //     'Business logic error',
    //     `Cannot deactivate business with ${activeContracts} active contract(s)`
    //   );
    // }

    // Optional: Check for pending invoices
    // const pendingInvoices = await InvoiceModel.count({
    //   where: { businessId: business.businessId, status: 'pending' },
    //   transaction: options?.transaction,
    // });
    //
    // if (pendingInvoices > 0) {
    //   throw new ValidationError(
    //     'Business logic error',
    //     `Cannot deactivate business with ${pendingInvoices} pending invoice(s)`
    //   );
    // }

    // ========================================================================
    // STEP 6: DATABASE UPDATE OPERATION
    // ========================================================================

    const updatedBusiness = await updateBusiness(
      businessId,
      {
        active: false,
        closureDate: finalClosureDate,
      },
      options
    );

    return {
      ...updatedBusiness,
      message: 'Business deactivated successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
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
      'Error deactivating business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
