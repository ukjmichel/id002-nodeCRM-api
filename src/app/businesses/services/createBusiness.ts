/**
 * Create Business Service
 * Creates a new business record with comprehensive validation and database checks
 */

import type { CreateOptions } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { BusinessModel } from '../models/business.model.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessAttributes } from '../interfaces/business.interface.js';
import {
  validatePostalCode,
  validateNafCode,
  validateVatNumber,
  validateLegalForm,
  validateEmail,
  validatePhone,
  normalizeEmail,
} from '../utils/duplicateValidation.js';

/**
 * Options for create operation
 * Extends Sequelize CreateOptions to ensure type compatibility
 */
type CreateBusinessOptions = Pick<CreateOptions<any>, 'transaction'>;

/**
 * Create a new business
 *
 * @param data - Business data to create
 * @param options - Create options (transaction support)
 * @returns Created business record
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const newBusiness = await createBusiness({
 *   userId: 'user-uuid',
 *   siret: '12345678901234',
 *   siren: '123456789',
 *   legalName: 'ACME Corporation',
 *   legalForm: 'SARL',
 *   addressLine1: '123 Rue de la Paix',
 *   postalCode: '75001',
 *   city: 'Paris',
 *   country: 'FR'
 * });
 * ```
 */
export const createBusiness = async (
  data: Partial<BusinessAttributes>,
  options?: CreateBusinessOptions
): Promise<ApiResponse<BusinessModel>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE REQUIRED FIELDS
    // ========================================================================

    if (!data.userId) {
      throw new ValidationError('Validation failed', 'User ID is required');
    }

    if (!data.siret) {
      throw new ValidationError('Validation failed', 'SIRET is required');
    }

    if (!data.siren) {
      throw new ValidationError('Validation failed', 'SIREN is required');
    }

    if (!data.legalName) {
      throw new ValidationError('Validation failed', 'Legal name is required');
    }

    if (!data.legalForm) {
      throw new ValidationError('Validation failed', 'Legal form is required');
    }

    if (!data.addressLine1) {
      throw new ValidationError(
        'Validation failed',
        'Address line 1 is required'
      );
    }

    if (!data.postalCode) {
      throw new ValidationError('Validation failed', 'Postal code is required');
    }

    if (!data.city) {
      throw new ValidationError('Validation failed', 'City is required');
    }

    // ========================================================================
    // STEP 2: NORMALIZE AND VALIDATE SIRET/SIREN
    // ========================================================================

    // Normalize SIRET and SIREN (remove spaces)
    const normalizedSiret = data.siret.replace(/\s+/g, '');
    const normalizedSiren = data.siren.replace(/\s+/g, '');

    // Validate SIRET format (14 digits)
    if (!/^\d{14}$/.test(normalizedSiret)) {
      throw new ValidationError(
        'Validation failed',
        'SIRET must be exactly 14 digits'
      );
    }

    // Validate SIREN format (9 digits)
    if (!/^\d{9}$/.test(normalizedSiren)) {
      throw new ValidationError(
        'Validation failed',
        'SIREN must be exactly 9 digits'
      );
    }

    // Validate SIREN matches first 9 digits of SIRET
    if (normalizedSiret.substring(0, 9) !== normalizedSiren) {
      throw new ValidationError(
        'Validation failed',
        'SIREN must match the first 9 digits of SIRET'
      );
    }

    // ========================================================================
    // STEP 3: FORMAT VALIDATIONS
    // ========================================================================

    // Validate postal code
    if (data.postalCode) {
      validatePostalCode(data.postalCode);
    }

    // Validate NAF code if provided
    if (data.nafCode) {
      validateNafCode(data.nafCode);
    }

    // Validate VAT number if provided
    if (data.vatNumber) {
      validateVatNumber(data.vatNumber);
    }

    // Validate legal form
    validateLegalForm(data.legalForm);

    // Validate email if provided
    if (data.email) {
      validateEmail(data.email);
    }

    // Validate phone if provided
    if (data.phone) {
      validatePhone(data.phone);
    }

    // ========================================================================
    // STEP 4: DATABASE DUPLICATE CHECKS
    // ========================================================================

    // Check if SIRET already exists
    const existingSiret = await BusinessModel.findOne({
      where: { siret: normalizedSiret },
      attributes: ['businessId', 'siret', 'legalName'],
      transaction: options?.transaction,
    });

    if (existingSiret) {
      throw new ValidationError(
        'Duplicate SIRET',
        `A business with SIRET ${normalizedSiret} already exists (${
          existingSiret.legalName || 'Unknown'
        })`
      );
    }

    // Check if SIREN already exists
    const existingSiren = await BusinessModel.findOne({
      where: { siren: normalizedSiren },
      attributes: ['businessId', 'siren', 'legalName'],
      transaction: options?.transaction,
    });

    if (existingSiren) {
      throw new ValidationError(
        'Duplicate SIREN',
        `A business with SIREN ${normalizedSiren} already exists (${
          existingSiren.legalName || 'Unknown'
        })`
      );
    }

    // Check for duplicate email if provided
    if (data.email) {
      const normalizedEmailValue = normalizeEmail(data.email);
      const existingEmail = await BusinessModel.findOne({
        where: { email: normalizedEmailValue },
        attributes: ['businessId', 'email', 'legalName'],
        transaction: options?.transaction,
      });

      if (existingEmail) {
        throw new ValidationError(
          'Duplicate email',
          `A business with email '${normalizedEmailValue}' already exists (${
            existingEmail.legalName || 'Unknown'
          })`
        );
      }
    }

    // Check for duplicate VAT number if provided
    if (data.vatNumber) {
      const existingVat = await BusinessModel.findOne({
        where: { vatNumber: data.vatNumber },
        attributes: ['businessId', 'vatNumber', 'legalName'],
        transaction: options?.transaction,
      });

      if (existingVat) {
        throw new ValidationError(
          'Duplicate VAT number',
          `A business with VAT number '${data.vatNumber}' already exists (${
            existingVat.legalName || 'Unknown'
          })`
        );
      }
    }

    // Check for duplicate RCS registration if both provided
    if (data.rcsNumber && data.rcsCity) {
      const existingRcs = await BusinessModel.findOne({
        where: {
          rcsNumber: data.rcsNumber,
          rcsCity: data.rcsCity,
        },
        attributes: ['businessId', 'rcsNumber', 'rcsCity', 'legalName'],
        transaction: options?.transaction,
      });

      if (existingRcs) {
        throw new ValidationError(
          'Duplicate RCS registration',
          `A business with RCS ${data.rcsNumber} (${
            data.rcsCity
          }) already exists (${existingRcs.legalName || 'Unknown'})`
        );
      }
    }

    // ========================================================================
    // STEP 5: NORMALIZE AND SANITIZE DATA
    // ========================================================================

    const normalizedData = {
      ...data,
      siret: normalizedSiret,
      siren: normalizedSiren,
      email: data.email ? normalizeEmail(data.email) : undefined,
      legalName: data.legalName.trim(),
      tradeName: data.tradeName?.trim(),
      city: data.city.trim(),
      addressLine1: data.addressLine1.trim(),
      addressLine2: data.addressLine2?.trim(),
      region: data.region?.trim(),
      department: data.department?.trim(),
      nafCode: data.nafCode?.trim(),
      vatNumber: data.vatNumber?.trim(),
      rcsNumber: data.rcsNumber?.trim(),
      rcsCity: data.rcsCity?.trim(),
      website: data.website?.trim(),
      phone: data.phone?.replace(/\s+/g, ' ').trim(),
      country: data.country || 'FR',
      capitalCurrency: data.capitalCurrency || 'EUR',
      active: data.active !== undefined ? data.active : true,
      vatExempt: data.vatExempt !== undefined ? data.vatExempt : false,
    };

    // ========================================================================
    // STEP 6: DATABASE CREATE OPERATION
    // ========================================================================

    const record = await BusinessModel.create(normalizedData as any, {
      transaction: options?.transaction,
    });

    return {
      success: true,
      data: record,
      message: 'Business created successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    // Re-throw ValidationError as-is
    if (error instanceof ValidationError) {
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
        'The specified user ID does not exist'
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
      'Error creating Business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
