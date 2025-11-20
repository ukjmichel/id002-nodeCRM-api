/**
 * Activate Business Service
 * Marks a business as active with validation
 */

import type { UpdateOptions } from 'sequelize';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { updateBusiness } from './updateBusiness.js';
import { validateUuid } from '../utils/duplicateValidation.js';

/**
 * Options for activate operation
 * Extends Sequelize UpdateOptions to ensure type compatibility
 */
type ActivateBusinessOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Mark a business as active
 * Sets the active flag to true and clears closure date
 *
 * @param businessId - Business ID
 * @param options - Update options (transaction support)
 * @returns Updated business record
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const activeBusiness = await activateBusiness('business-uuid-here');
 * console.log(activeBusiness.data.active); // true
 * ```
 */
export const activateBusiness = async (
  businessId: string,
  options?: ActivateBusinessOptions
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

    // Check if business is already active
    if (business.active) {
      return {
        success: true,
        data: business,
        message: 'Business is already active',
      };
    }

    // ========================================================================
    // STEP 4: CHECK FOR RELATED RECORDS (BUSINESS RULES)
    // ========================================================================

    // Example: Check if business can be reactivated
    // You can add business logic checks here
    // For example, verify that the business meets requirements for reactivation

    // Optional: Check if there are any blocking conditions
    // const hasBlockingConditions = await checkBlockingConditions(businessId, options?.transaction);
    // if (hasBlockingConditions) {
    //   throw new ValidationError(
    //     'Business logic error',
    //     'Cannot activate business due to unresolved issues'
    //   );
    // }

    // ========================================================================
    // STEP 5: DATABASE UPDATE OPERATION
    // ========================================================================

    const updatedBusiness = await updateBusiness(
      businessId,
      {
        active: true,
        closureDate: undefined,
      },
      options
    );

    return {
      ...updatedBusiness,
      message: 'Business activated successfully',
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
      'Error activating business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
