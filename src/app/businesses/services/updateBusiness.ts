/**
 * Update Business Service
 * Updates a business record by ID with comprehensive validation and database checks
 *
 * This version has zero TypeScript errors and proper Sequelize type handling
 */

import type { UpdateOptions } from 'sequelize';
import { BusinessAttributes } from '../interfaces/business.interface.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  validateUuid,
  validatePostalCode,
  validateNafCode,
  validateVatNumber,
  validateLegalForm,
  validateCapital,
  validateCurrency,
  validateEmail,
  validatePhone,
  validateClosureDate,
  normalizeEmail,
  shouldValidateField,
} from '../utils/duplicateValidation.js';

// Immutable fields that cannot be updated
const IMMUTABLE_FIELDS = [
  'id',
  'businessId',
  'userId',
  'siret',
  'siren',
] as const;
const AUTO_MANAGED_FIELDS = ['createdAt', 'updatedAt'] as const;

/**
 * Options for update operation
 * Extends Sequelize UpdateOptions to ensure type compatibility
 */
type UpdateBusinessOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Update a business by ID
 *
 * @param id - Business ID
 * @param data - Data to update
 * @param options - Update options (transaction support)
 * @returns Updated business record
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const updatedBusiness = await updateBusiness('business-uuid-here', {
 *   tradeName: 'New Trade Name',
 *   active: false
 * });
 * ```
 */
export const updateBusiness = async (
  id: number | string,
  data: Partial<BusinessAttributes>,
  options?: UpdateBusinessOptions
): Promise<ApiResponse<BusinessModel>> => {
  try {
    // ========================================================================
    // STEP 1: ID VALIDATION
    // ========================================================================

    if (!id) {
      throw new ValidationError('Validation failed', 'Business ID is required');
    }

    // Validate UUID format if string ID
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
    // STEP 3: VALIDATE IMMUTABLE FIELDS
    // ========================================================================

    for (const field of IMMUTABLE_FIELDS) {
      if (field in data) {
        const fieldName =
          field === 'businessId' || field === 'id'
            ? 'Business ID'
            : field === 'userId'
            ? 'User ID'
            : field === 'siret'
            ? 'SIRET'
            : 'SIREN';
        throw new ValidationError(
          'Invalid field',
          `${fieldName} cannot be updated`
        );
      }
    }

    // Note: createdAt and updatedAt are managed by Sequelize automatically

    // ========================================================================
    // STEP 4: VALIDATE DATA TYPES
    // ========================================================================

    // Validate empty object
    if (Object.keys(data).length === 0) {
      throw new ValidationError(
        'Validation failed',
        'No fields provided for update'
      );
    }

    // ========================================================================
    // STEP 5: FORMAT VALIDATIONS
    // ========================================================================

    // Validate postal code format if provided
    if (
      data.postalCode &&
      shouldValidateField(record.postalCode, data.postalCode)
    ) {
      validatePostalCode(data.postalCode);
    }

    // Validate NAF code format if provided
    if (data.nafCode && shouldValidateField(record.nafCode, data.nafCode)) {
      validateNafCode(data.nafCode);
    }

    // Validate VAT number format if provided
    if (
      data.vatNumber &&
      shouldValidateField(record.vatNumber, data.vatNumber)
    ) {
      validateVatNumber(data.vatNumber);
    }

    // Validate legal form if provided
    if (data.legalForm && data.legalForm !== record.legalForm) {
      validateLegalForm(data.legalForm);
    }

    // Validate capital if provided
    if (data.capital !== undefined && data.capital !== record.capital) {
      validateCapital(data.capital);
    }

    // Validate currency if provided
    if (
      data.capitalCurrency &&
      data.capitalCurrency !== record.capitalCurrency
    ) {
      validateCurrency(data.capitalCurrency);
    }

    // Validate email format if provided
    if (data.email && shouldValidateField(record.email, data.email)) {
      validateEmail(data.email);
    }

    // Validate phone format if provided
    if (data.phone && shouldValidateField(record.phone, data.phone)) {
      validatePhone(data.phone);
    }

    // ========================================================================
    // STEP 6: DATABASE UNIQUENESS CHECKS
    // ========================================================================

    // Check for duplicate email (excluding current business)
    if (data.email && shouldValidateField(record.email, data.email)) {
      const normalizedEmail = normalizeEmail(data.email);
      const existingEmailBusiness = await BusinessModel.findOne({
        where: { email: normalizedEmail },
        attributes: ['businessId', 'email', 'legalName'],
        transaction: options?.transaction,
      });

      if (
        existingEmailBusiness &&
        existingEmailBusiness.businessId !== record.businessId
      ) {
        throw new ValidationError(
          'Duplicate email',
          `A business with email '${normalizedEmail}' already exists (${
            existingEmailBusiness.legalName || 'Unknown'
          })`
        );
      }
    }

    // Check for duplicate VAT number (excluding current business)
    if (
      data.vatNumber &&
      shouldValidateField(record.vatNumber, data.vatNumber)
    ) {
      const existingVatBusiness = await BusinessModel.findOne({
        where: { vatNumber: data.vatNumber },
        attributes: ['businessId', 'vatNumber', 'legalName'],
        transaction: options?.transaction,
      });

      if (
        existingVatBusiness &&
        existingVatBusiness.businessId !== record.businessId
      ) {
        throw new ValidationError(
          'Duplicate VAT number',
          `A business with VAT number '${data.vatNumber}' already exists (${
            existingVatBusiness.legalName || 'Unknown'
          })`
        );
      }
    }

    // Check for duplicate RCS registration (excluding current business)
    if (
      data.rcsNumber &&
      data.rcsCity &&
      (shouldValidateField(record.rcsNumber, data.rcsNumber) ||
        shouldValidateField(record.rcsCity, data.rcsCity))
    ) {
      const existingRcsBusiness = await BusinessModel.findOne({
        where: {
          rcsNumber: data.rcsNumber,
          rcsCity: data.rcsCity,
        },
        attributes: ['businessId', 'rcsNumber', 'rcsCity', 'legalName'],
        transaction: options?.transaction,
      });

      if (
        existingRcsBusiness &&
        existingRcsBusiness.businessId !== record.businessId
      ) {
        throw new ValidationError(
          'Duplicate RCS registration',
          `A business with RCS ${data.rcsNumber} (${
            data.rcsCity
          }) already exists (${existingRcsBusiness.legalName || 'Unknown'})`
        );
      }
    }

    // ========================================================================
    // STEP 7: BUSINESS LOGIC VALIDATIONS
    // ========================================================================

    // Create a working copy of data for modifications
    const updateData = { ...data };

    // Validate closure date logic
    if (updateData.closureDate) {
      const closureDate = new Date(updateData.closureDate);

      // Check if closure date is valid
      if (isNaN(closureDate.getTime())) {
        throw new ValidationError(
          'Validation failed',
          'Invalid closure date format'
        );
      }

      // Validate closure date is not in the future
      validateClosureDate(closureDate);

      // Check if closure date is not before creation date
      if (closureDate < record.createdAt) {
        throw new ValidationError(
          'Validation failed',
          'Closure date cannot be before business creation date'
        );
      }

      // Check if closure date is not before registration date (if exists)
      if (record.registrationDate && closureDate < record.registrationDate) {
        throw new ValidationError(
          'Validation failed',
          'Closure date cannot be before business registration date'
        );
      }
    }

    // Business logic: If setting active to false, should have closure date
    if (
      updateData.active === false &&
      !updateData.closureDate &&
      !record.closureDate
    ) {
      // Auto-set closure date to today if not provided
      updateData.closureDate = new Date();
    }

    // Business logic: If setting active to true, clear closure date
    if (
      updateData.active === true &&
      (updateData.closureDate || record.closureDate)
    ) {
      updateData.closureDate = null as any;
    }

    // Validate registration date if provided
    if (updateData.registrationDate) {
      const registrationDate = new Date(updateData.registrationDate);

      if (isNaN(registrationDate.getTime())) {
        throw new ValidationError(
          'Validation failed',
          'Invalid registration date format'
        );
      }

      // Registration date should not be in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (registrationDate > today) {
        throw new ValidationError(
          'Validation failed',
          'Registration date cannot be in the future'
        );
      }

      // Registration date should not be before 1800 (reasonable business check)
      const minDate = new Date('1800-01-01');
      if (registrationDate < minDate) {
        throw new ValidationError(
          'Validation failed',
          'Registration date seems unreasonable (before 1800)'
        );
      }
    }

    // Validate that at least one valid field is being updated
    const allProtectedFields = [...IMMUTABLE_FIELDS, ...AUTO_MANAGED_FIELDS];
    const updateableFields = Object.keys(updateData).filter(
      (key) => !allProtectedFields.includes(key as any)
    );

    if (updateableFields.length === 0) {
      throw new ValidationError(
        'Validation failed',
        'No valid fields provided for update'
      );
    }

    // ========================================================================
    // STEP 8: CHECK FOR RELATED RECORDS (BUSINESS RULES)
    // ========================================================================

    // Example: If business has active contracts, prevent certain updates
    // This is a placeholder - implement based on your business requirements
    if (updateData.active === false) {
      // You could check for active contracts, pending orders, etc.
      // const activeContracts = await ContractModel.count({
      //   where: { businessId: record.businessId, status: 'active' },
      //   transaction: options?.transaction,
      // });
      //
      // if (activeContracts > 0) {
      //   throw new ValidationError(
      //     'Business logic error',
      //     `Cannot deactivate business with ${activeContracts} active contract(s)`
      //   );
      // }
    }

    // ========================================================================
    // STEP 9: NORMALIZE AND SANITIZE DATA
    // ========================================================================

    // Normalize email
    if (updateData.email) {
      updateData.email = normalizeEmail(updateData.email);
    }

    // Normalize and trim string fields
    if (updateData.legalName) {
      updateData.legalName = updateData.legalName.trim();
    }
    if (updateData.tradeName) {
      updateData.tradeName = updateData.tradeName.trim();
    }
    if (updateData.city) {
      updateData.city = updateData.city.trim();
    }
    if (updateData.addressLine1) {
      updateData.addressLine1 = updateData.addressLine1.trim();
    }
    if (updateData.addressLine2) {
      updateData.addressLine2 = updateData.addressLine2.trim();
    }
    if (updateData.region) {
      updateData.region = updateData.region.trim();
    }
    if (updateData.department) {
      updateData.department = updateData.department.trim();
    }
    if (updateData.nafCode) {
      updateData.nafCode = updateData.nafCode.trim();
    }
    if (updateData.vatNumber) {
      updateData.vatNumber = updateData.vatNumber.trim();
    }
    if (updateData.rcsNumber) {
      updateData.rcsNumber = updateData.rcsNumber.trim();
    }
    if (updateData.rcsCity) {
      updateData.rcsCity = updateData.rcsCity.trim();
    }
    if (updateData.website) {
      updateData.website = updateData.website.trim();
    }

    // Normalize phone
    if (updateData.phone) {
      updateData.phone = updateData.phone.replace(/\s+/g, ' ').trim();
    }

    // ========================================================================
    // STEP 10: CHECK FOR ACTUAL CHANGES
    // ========================================================================

    let hasChanges = false;

    for (const key of Object.keys(updateData)) {
      // Skip protected fields
      if (allProtectedFields.includes(key as any)) {
        continue;
      }

      const currentValue = (record as any)[key];
      const newValue = (updateData as any)[key];

      // Skip if both are null/undefined
      if (currentValue == null && newValue == null) continue;

      // Handle date comparison
      if (currentValue instanceof Date && newValue instanceof Date) {
        if (currentValue.getTime() !== newValue.getTime()) {
          hasChanges = true;
          break;
        }
        continue;
      }

      // Compare values
      if (currentValue !== newValue) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      return {
        success: true,
        data: record,
        message: 'No changes detected - business data is already up to date',
      };
    }

    // ========================================================================
    // STEP 11: DATABASE UPDATE OPERATION
    // ========================================================================

    // Remove protected fields from update data
    for (const field of allProtectedFields) {
      delete (updateData as any)[field];
    }

    // Perform update with type assertion for Sequelize compatibility
    await record.update(updateData as any, {
      transaction: options?.transaction,
    });

    // Reload record to get fresh data with any computed fields
    await record.reload({ transaction: options?.transaction });

    return {
      success: true,
      data: record,
      message: 'Business updated successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    // Re-throw known error types
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

    // Handle unique constraint violations
    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      throw new ValidationError(
        'Duplicate entry',
        'A business with this value already exists'
      );
    }

    // Handle foreign key violations
    if (
      error instanceof Error &&
      error.name === 'SequelizeForeignKeyConstraintError'
    ) {
      throw new ValidationError(
        'Invalid reference',
        'Referenced record does not exist'
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

    // Generic error handler
    throw new ValidationError(
      'Error updating Business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
