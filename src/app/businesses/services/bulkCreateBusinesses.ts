/**
 * Bulk Create Businesses Service
 * Creates multiple business records at once with comprehensive validation and database checks
 */

import type { BulkCreateOptions } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessAttributes } from '../interfaces/business.interface.js';
import { BusinessModel } from '../models/business.model.js';
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
 * Options for bulk create operation
 * Extends Sequelize BulkCreateOptions to ensure type compatibility
 */
type BulkCreateBusinessOptions = {
  transaction?: BulkCreateOptions<any>['transaction'];
  validate?: boolean;
  ignoreDuplicates?: boolean;
  updateOnDuplicate?: (keyof BusinessAttributes)[];
};

/**
 * Validate a single business record
 */
const validateBusinessRecord = (
  data: Partial<BusinessAttributes>,
  index: number
): void => {
  const prefix = `Business at index ${index}:`;

  // ========================================================================
  // VALIDATE REQUIRED FIELDS
  // ========================================================================

  if (!data.userId) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} User ID is required`
    );
  }

  if (!data.siret) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} SIRET is required`
    );
  }

  if (!data.siren) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} SIREN is required`
    );
  }

  if (!data.legalName) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Legal name is required`
    );
  }

  if (!data.legalForm) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Legal form is required`
    );
  }

  if (!data.addressLine1) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Address line 1 is required`
    );
  }

  if (!data.postalCode) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Postal code is required`
    );
  }

  if (!data.city) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} City is required`
    );
  }

  // ========================================================================
  // NORMALIZE AND VALIDATE SIRET/SIREN
  // ========================================================================

  const normalizedSiret = data.siret.replace(/\s+/g, '');
  const normalizedSiren = data.siren.replace(/\s+/g, '');

  // Validate SIRET format
  if (!/^\d{14}$/.test(normalizedSiret)) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} SIRET must be exactly 14 digits`
    );
  }

  // Validate SIREN format
  if (!/^\d{9}$/.test(normalizedSiren)) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} SIREN must be exactly 9 digits`
    );
  }

  // Validate SIREN matches SIRET
  if (normalizedSiret.substring(0, 9) !== normalizedSiren) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} SIREN must match the first 9 digits of SIRET`
    );
  }

  // ========================================================================
  // FORMAT VALIDATIONS
  // ========================================================================

  // Validate postal code
  try {
    validatePostalCode(data.postalCode);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error.details || error.message}`
      );
    }
    throw new ValidationError(
      'Validation failed',
      `${prefix} ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Validate NAF code if provided
  if (data.nafCode) {
    try {
      validateNafCode(data.nafCode);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          'Validation failed',
          `${prefix} ${error.details || error.message}`
        );
      }
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Validate VAT number if provided
  if (data.vatNumber) {
    try {
      validateVatNumber(data.vatNumber);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          'Validation failed',
          `${prefix} ${error.details || error.message}`
        );
      }
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Validate legal form
  try {
    validateLegalForm(data.legalForm);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error.details || error.message}`
      );
    }
    throw new ValidationError(
      'Validation failed',
      `${prefix} ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Validate email if provided
  if (data.email) {
    try {
      validateEmail(data.email);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          'Validation failed',
          `${prefix} ${error.details || error.message}`
        );
      }
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Validate phone if provided
  if (data.phone) {
    try {
      validatePhone(data.phone);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(
          'Validation failed',
          `${prefix} ${error.details || error.message}`
        );
      }
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
};

/**
 * Bulk create businesses
 *
 * @param dataArray - Array of business data to create
 * @param options - Sequelize bulk create options (transaction support)
 * @returns Created business records
 * @throws {ValidationError} When bulk creation fails
 *
 * @example
 * ```typescript
 * const businesses = await bulkCreateBusinesses([
 *   { siret: '12345678901234', siren: '123456789', ... },
 *   { siret: '98765432109876', siren: '987654321', ... }
 * ], { validate: true, transaction: t });
 * ```
 */
export const bulkCreateBusinesses = async (
  dataArray: Partial<BusinessAttributes>[],
  options?: BulkCreateBusinessOptions
): Promise<ApiResponse<BusinessModel[]>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE ARRAY
    // ========================================================================

    // Validate array is not empty
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new ValidationError(
        'Validation failed',
        'Data array must contain at least one business'
      );
    }

    // Validate maximum bulk size (prevent memory issues)
    if (dataArray.length > 1000) {
      throw new ValidationError(
        'Validation failed',
        'Cannot create more than 1000 businesses at once'
      );
    }

    // ========================================================================
    // STEP 2: VALIDATE EACH RECORD
    // ========================================================================

    dataArray.forEach((data, index) => {
      validateBusinessRecord(data, index);
    });

    // ========================================================================
    // STEP 3: CHECK FOR DUPLICATES WITHIN ARRAY
    // ========================================================================

    // Check for duplicate SIRETs within the array
    const sirets = dataArray.map((d) => d.siret!.replace(/\s+/g, ''));
    const uniqueSirets = new Set(sirets);

    if (sirets.length !== uniqueSirets.size) {
      const duplicates = sirets.filter(
        (item, index) => sirets.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate SIRETs found in the data array: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // Check for duplicate SIRENs within the array
    const sirens = dataArray.map((d) => d.siren!.replace(/\s+/g, ''));
    const uniqueSirens = new Set(sirens);

    if (sirens.length !== uniqueSirens.size) {
      const duplicates = sirens.filter(
        (item, index) => sirens.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate SIRENs found in the data array: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // Check for duplicate emails within the array (if provided)
    const emailsInArray = dataArray
      .filter((d) => d.email)
      .map((d) => normalizeEmail(d.email!));

    const uniqueEmails = new Set(emailsInArray);

    if (emailsInArray.length !== uniqueEmails.size) {
      const duplicates = emailsInArray.filter(
        (item, index) => emailsInArray.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate emails found in the data array: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // Check for duplicate VAT numbers within the array (if provided)
    const vatNumbersInArray = dataArray
      .filter((d) => d.vatNumber)
      .map((d) => d.vatNumber!.trim());

    const uniqueVatNumbers = new Set(vatNumbersInArray);

    if (vatNumbersInArray.length !== uniqueVatNumbers.size) {
      const duplicates = vatNumbersInArray.filter(
        (item, index) => vatNumbersInArray.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate VAT numbers found in the data array: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // ========================================================================
    // STEP 4: DATABASE DUPLICATE CHECKS
    // ========================================================================

    // Check for existing SIRETs in database
    const existingSirets = await BusinessModel.findAll({
      where: { siret: sirets },
      attributes: ['siret', 'legalName'],
      transaction: options?.transaction,
    });

    if (existingSirets.length > 0) {
      const existingSiretsStr = existingSirets
        .map((b) => `${b.siret} (${b.legalName || 'Unknown'})`)
        .join(', ');
      throw new ValidationError(
        'Duplicate SIRET',
        `The following SIRETs already exist: ${existingSiretsStr}`
      );
    }

    // Check for existing SIRENs in database
    const existingSirens = await BusinessModel.findAll({
      where: { siren: sirens },
      attributes: ['siren', 'legalName'],
      transaction: options?.transaction,
    });

    if (existingSirens.length > 0) {
      const existingSirensStr = existingSirens
        .map((b) => `${b.siren} (${b.legalName || 'Unknown'})`)
        .join(', ');
      throw new ValidationError(
        'Duplicate SIREN',
        `The following SIRENs already exist: ${existingSirensStr}`
      );
    }

    // Check for existing emails in database (if provided)
    if (emailsInArray.length > 0) {
      const existingEmails = await BusinessModel.findAll({
        where: { email: emailsInArray },
        attributes: ['email', 'legalName'],
        transaction: options?.transaction,
      });

      if (existingEmails.length > 0) {
        const existingEmailsStr = existingEmails
          .map((b) => `${b.email} (${b.legalName || 'Unknown'})`)
          .join(', ');
        throw new ValidationError(
          'Duplicate email',
          `The following emails already exist: ${existingEmailsStr}`
        );
      }
    }

    // Check for existing VAT numbers in database (if provided)
    if (vatNumbersInArray.length > 0) {
      const existingVatNumbers = await BusinessModel.findAll({
        where: { vatNumber: vatNumbersInArray },
        attributes: ['vatNumber', 'legalName'],
        transaction: options?.transaction,
      });

      if (existingVatNumbers.length > 0) {
        const existingVatNumbersStr = existingVatNumbers
          .map((b) => `${b.vatNumber} (${b.legalName || 'Unknown'})`)
          .join(', ');
        throw new ValidationError(
          'Duplicate VAT number',
          `The following VAT numbers already exist: ${existingVatNumbersStr}`
        );
      }
    }

    // ========================================================================
    // STEP 5: CHECK FOR RELATED RECORDS (BUSINESS RULES)
    // ========================================================================

    // Example: Verify all user IDs exist before bulk creation
    // const userIds = [...new Set(dataArray.map(d => d.userId))];
    // const existingUsers = await UserModel.count({
    //   where: { userId: userIds },
    //   transaction: options?.transaction,
    // });
    //
    // if (existingUsers !== userIds.length) {
    //   throw new ValidationError(
    //     'Invalid reference',
    //     'One or more user IDs do not exist'
    //   );
    // }

    // ========================================================================
    // STEP 6: NORMALIZE AND SANITIZE DATA
    // ========================================================================

    const normalizedData = dataArray.map((data) => {
      const normalized: any = {
        userId: data.userId,
        siret: data.siret!.replace(/\s+/g, ''),
        siren: data.siren!.replace(/\s+/g, ''),
        legalName: data.legalName!.trim(),
        legalForm: data.legalForm,
        addressLine1: data.addressLine1!.trim(),
        postalCode: data.postalCode,
        city: data.city!.trim(),
        country: data.country || 'FR',
        capitalCurrency: data.capitalCurrency || 'EUR',
        active: data.active !== undefined ? data.active : true,
        vatExempt: data.vatExempt !== undefined ? data.vatExempt : false,
      };

      // Add optional fields only if they exist
      if (data.tradeName) normalized.tradeName = data.tradeName.trim();
      if (data.addressLine2) normalized.addressLine2 = data.addressLine2.trim();
      if (data.region) normalized.region = data.region.trim();
      if (data.department) normalized.department = data.department.trim();
      if (data.nafCode) normalized.nafCode = data.nafCode.trim();
      if (data.vatNumber) normalized.vatNumber = data.vatNumber.trim();
      if (data.rcsNumber) normalized.rcsNumber = data.rcsNumber.trim();
      if (data.rcsCity) normalized.rcsCity = data.rcsCity.trim();
      if (data.website) normalized.website = data.website.trim();
      if (data.email) normalized.email = normalizeEmail(data.email);
      if (data.phone) normalized.phone = data.phone.replace(/\s+/g, ' ').trim();
      if (data.capital !== undefined) normalized.capital = data.capital;
      if (data.registrationDate)
        normalized.registrationDate = data.registrationDate;
      if (data.closureDate) normalized.closureDate = data.closureDate;

      return normalized;
    });

    // ========================================================================
    // STEP 7: DATABASE BULK CREATE OPERATION
    // ========================================================================

    const records = await BusinessModel.bulkCreate(normalizedData as any[], {
      transaction: options?.transaction,
      validate: options?.validate !== undefined ? options.validate : true,
      ignoreDuplicates: options?.ignoreDuplicates,
      updateOnDuplicate: options?.updateOnDuplicate as any,
    });

    return {
      success: true,
      data: records,
      message: `Successfully created ${records.length} business${
        records.length > 1 ? 'es' : ''
      }`,
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
        'Validation failed for Businesses',
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
        'One or more businesses with these values already exist'
      );
    }

    // Handle foreign key violations
    if (
      error instanceof Error &&
      error.name === 'SequelizeForeignKeyConstraintError'
    ) {
      throw new ValidationError(
        'Invalid reference',
        'One or more user IDs do not exist'
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
    console.error('Bulk create error:', error);
    throw new ValidationError(
      'Error bulk creating Businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
