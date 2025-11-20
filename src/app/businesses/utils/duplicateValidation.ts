// src/app/businesses/utils/duplicateValidation.ts
/**
 * Duplicate Validation Utilities for Businesses
 * Reusable functions for checking duplicate SIRET/SIREN and other fields
 */

import { Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { BusinessModel } from '../models/business.model.js';

/**
 * Normalize SIRET by removing spaces and non-digit characters
 * @param siret - SIRET to normalize
 * @returns Normalized SIRET
 */
export const normalizeSiret = (siret: string): string => {
  return siret.replace(/\s+/g, '').replace(/\D/g, '');
};

/**
 * Normalize SIREN by removing spaces and non-digit characters
 * @param siren - SIREN to normalize
 * @returns Normalized SIREN
 */
export const normalizeSiren = (siren: string): string => {
  return siren.replace(/\s+/g, '').replace(/\D/g, '');
};

/**
 * Normalize email to lowercase and trim whitespace
 * @param email - Email to normalize
 * @returns Normalized email
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Check if a SIRET is already registered in the database
 *
 * @param siret - SIRET to check
 * @param excludeBusinessId - Optional business ID to exclude from check (for updates)
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When SIRET already exists
 *
 * @example
 * ```typescript
 * // Check for duplicate SIRET (create scenario)
 * await checkDuplicateSiret('12345678901234');
 *
 * // Check for duplicate SIRET excluding current business (update scenario)
 * await checkDuplicateSiret('12345678901234', 'business-uuid');
 *
 * // With transaction
 * await checkDuplicateSiret('12345678901234', undefined, transaction);
 * ```
 */
export const checkDuplicateSiret = async (
  siret: string,
  excludeBusinessId?: string | number,
  transaction?: Transaction
): Promise<void> => {
  const normalizedSiret = normalizeSiret(siret);

  const whereClause: any = { siret: normalizedSiret };

  // Exclude current business if updating
  if (excludeBusinessId !== undefined) {
    whereClause.businessId = { [Op.ne]: excludeBusinessId };
  }

  const existingBusiness = await BusinessModel.findOne({
    where: whereClause,
    attributes: ['businessId', 'siret', 'legalName'],
    transaction,
  });

  if (existingBusiness) {
    throw new ValidationError(
      'Duplicate SIRET',
      `Business with SIRET '${normalizedSiret}' already exists${
        excludeBusinessId ? ' for another business' : ''
      }${existingBusiness.legalName ? ` (${existingBusiness.legalName})` : ''}`
    );
  }
};

/**
 * Validate SIRET format
 *
 * @param siret - SIRET to validate
 * @throws {ValidationError} When SIRET format is invalid
 *
 * @example
 * ```typescript
 * validateSiretFormat('12345678901234'); // Valid
 * validateSiretFormat('123'); // Throws error
 * ```
 */
export const validateSiretFormat = (siret: string): void => {
  const normalizedSiret = normalizeSiret(siret);

  if (normalizedSiret.length !== 14) {
    throw new ValidationError(
      'Validation failed',
      'SIRET must be exactly 14 digits'
    );
  }

  if (!/^\d{14}$/.test(normalizedSiret)) {
    throw new ValidationError(
      'Validation failed',
      'SIRET must contain only numbers'
    );
  }
};

/**
 * Validate SIREN format
 *
 * @param siren - SIREN to validate
 * @throws {ValidationError} When SIREN format is invalid
 *
 * @example
 * ```typescript
 * validateSirenFormat('123456789'); // Valid
 * validateSirenFormat('123'); // Throws error
 * ```
 */
export const validateSirenFormat = (siren: string): void => {
  const normalizedSiren = normalizeSiren(siren);

  if (normalizedSiren.length !== 9) {
    throw new ValidationError(
      'Validation failed',
      'SIREN must be exactly 9 digits'
    );
  }

  if (!/^\d{9}$/.test(normalizedSiren)) {
    throw new ValidationError(
      'Validation failed',
      'SIREN must contain only numbers'
    );
  }
};

/**
 * Validate that SIREN matches the first 9 digits of SIRET
 *
 * @param siret - SIRET number
 * @param siren - SIREN number
 * @throws {ValidationError} When SIREN doesn't match SIRET
 *
 * @example
 * ```typescript
 * validateSiretSirenMatch('12345678901234', '123456789'); // Valid
 * validateSiretSirenMatch('12345678901234', '987654321'); // Throws error
 * ```
 */
export const validateSiretSirenMatch = (siret: string, siren: string): void => {
  const normalizedSiret = normalizeSiret(siret);
  const normalizedSiren = normalizeSiren(siren);

  if (normalizedSiret.substring(0, 9) !== normalizedSiren) {
    throw new ValidationError(
      'Validation failed',
      'SIREN must match the first 9 digits of SIRET'
    );
  }
};

/**
 * Comprehensive SIRET and SIREN validation
 *
 * @param siret - SIRET number
 * @param siren - SIREN number
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * validateSiretAndSiren('12345678901234', '123456789');
 * ```
 */
export const validateSiretAndSiren = (siret: string, siren: string): void => {
  validateSiretFormat(siret);
  validateSirenFormat(siren);
  validateSiretSirenMatch(siret, siren);
};

/**
 * Check for duplicate SIRETs in bulk data
 *
 * @param sirets - Array of SIRETs to check
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When any SIRET already exists in database
 *
 * @example
 * ```typescript
 * await checkBulkDuplicateSirets([
 *   '12345678901234',
 *   '98765432109876'
 * ]);
 * ```
 */
export const checkBulkDuplicateSirets = async (
  sirets: string[],
  transaction?: Transaction
): Promise<void> => {
  if (sirets.length === 0) return;

  const normalizedSirets = sirets.map(normalizeSiret);

  const existingBusinesses = await BusinessModel.findAll({
    where: { siret: normalizedSirets },
    attributes: ['siret', 'legalName'],
    transaction,
  });

  if (existingBusinesses.length > 0) {
    const existingSiretList = existingBusinesses.map(
      (business) => `${business.siret} (${business.legalName || 'Unknown'})`
    );
    throw new ValidationError(
      'Duplicate SIRET',
      `The following SIRETs are already registered: ${existingSiretList.join(
        ', '
      )}`
    );
  }
};

/**
 * Check for duplicate values within an array
 *
 * @param values - Array of values to check
 * @param fieldName - Name of the field (for error message)
 * @throws {ValidationError} When duplicates are found
 *
 * @example
 * ```typescript
 * checkDuplicatesInArray(['12345678901234', '12345678901234'], 'SIRETs');
 * // Throws: "Duplicate SIRETs in input: 12345678901234"
 * ```
 */
export const checkDuplicatesInArray = (
  values: string[],
  fieldName: string
): void => {
  const normalizedValues = values.map((v) =>
    fieldName.toLowerCase().includes('siret')
      ? normalizeSiret(v)
      : fieldName.toLowerCase().includes('siren')
      ? normalizeSiren(v)
      : v.trim().toLowerCase()
  );

  const duplicates = normalizedValues.filter(
    (value, index) => normalizedValues.indexOf(value) !== index
  );

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];
    throw new ValidationError(
      'Validation failed',
      `Duplicate ${fieldName} in input: ${uniqueDuplicates.join(', ')}`
    );
  }
};

/**
 * Validate bulk business data for duplicates within array and against database
 *
 * @param data - Array of business data
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When duplicates are found
 *
 * @example
 * ```typescript
 * await validateBulkBusinessData([
 *   { siret: '12345678901234', siren: '123456789', ... },
 *   { siret: '98765432109876', siren: '987654321', ... }
 * ]);
 * ```
 */
export const validateBulkBusinessData = async (
  data: Array<{ siret?: string; siren?: string }>,
  transaction?: Transaction
): Promise<void> => {
  // Extract and filter SIRETs
  const sirets = data
    .map((business) => business.siret)
    .filter((siret): siret is string => !!siret);

  // Check for duplicates within input array
  if (sirets.length > 0) {
    checkDuplicatesInArray(sirets, 'SIRETs');
  }

  // Validate each SIRET/SIREN pair
  data.forEach((business, index) => {
    if (business.siret && business.siren) {
      try {
        validateSiretAndSiren(business.siret, business.siren);
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new ValidationError(
            'Validation failed',
            `Business at index ${index}: ${error.message}`
          );
        }
        throw error;
      }
    }
  });

  // Check for duplicates in database
  await checkBulkDuplicateSirets(sirets, transaction);
};

/**
 * Validate French postal code format
 *
 * @param postalCode - Postal code to validate
 * @throws {ValidationError} When postal code format is invalid
 *
 * @example
 * ```typescript
 * validatePostalCode('75001'); // Valid
 * validatePostalCode('750'); // Throws error
 * ```
 */
export const validatePostalCode = (postalCode: string): void => {
  if (!/^\d{5}$/.test(postalCode)) {
    throw new ValidationError(
      'Validation failed',
      'Postal code must be exactly 5 digits'
    );
  }
};

/**
 * Validate NAF code format
 *
 * @param nafCode - NAF code to validate
 * @throws {ValidationError} When NAF code format is invalid
 *
 * @example
 * ```typescript
 * validateNafCode('62.01Z'); // Valid
 * validateNafCode('6201Z'); // Throws error
 * ```
 */
export const validateNafCode = (nafCode: string): void => {
  if (!/^\d{2}\.\d{2}[A-Z]?$/.test(nafCode)) {
    throw new ValidationError(
      'Validation failed',
      'NAF code must be in format XX.XXX (e.g., 62.01Z)'
    );
  }
};

/**
 * Validate French VAT number format
 *
 * @param vatNumber - VAT number to validate
 * @throws {ValidationError} When VAT number format is invalid
 *
 * @example
 * ```typescript
 * validateVatNumber('FR12123456789'); // Valid
 * validateVatNumber('FR123456789'); // Throws error
 * ```
 */
export const validateVatNumber = (vatNumber: string): void => {
  if (!/^FR[0-9A-Z]{2}\d{9}$/.test(vatNumber)) {
    throw new ValidationError(
      'Validation failed',
      'VAT number must be in format FRXX123456789'
    );
  }
};

/**
 * Validate legal form
 *
 * @param legalForm - Legal form to validate
 * @throws {ValidationError} When legal form is invalid
 *
 * @example
 * ```typescript
 * validateLegalForm('SARL'); // Valid
 * validateLegalForm('LLC'); // Throws error
 * ```
 */
export const validateLegalForm = (legalForm: string): void => {
  const validLegalForms = [
    'SARL',
    'EURL',
    'SAS',
    'SASU',
    'SA',
    'SNC',
    'SCS',
    'SCA',
    'EI',
    'EIRL',
    'Auto-entrepreneur',
    'Micro-entreprise',
    'Association',
    'SCI',
    'SCOP',
    'GIE',
    'Other',
  ];

  if (!validLegalForms.includes(legalForm)) {
    throw new ValidationError(
      'Validation failed',
      `Legal form must be one of: ${validLegalForms.join(', ')}`
    );
  }
};

/**
 * Validate email format
 *
 * @param email - Email to validate
 * @throws {ValidationError} When email format is invalid
 *
 * @example
 * ```typescript
 * validateEmail('test@example.com'); // Valid
 * validateEmail('invalid-email'); // Throws error
 * ```
 */
export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError(
      'Validation failed',
      'Email must be a valid email address'
    );
  }
};

/**
 * Validate phone number format
 *
 * @param phone - Phone number to validate
 * @throws {ValidationError} When phone format is invalid
 *
 * @example
 * ```typescript
 * validatePhone('+33 1 42 86 82 00'); // Valid
 * validatePhone('abc'); // Throws error
 * ```
 */
export const validatePhone = (phone: string): void => {
  if (!/^[+]?[0-9\s().-]{10,20}$/.test(phone)) {
    throw new ValidationError(
      'Validation failed',
      'Phone number format is invalid'
    );
  }
};

/**
 * Validate that closure date is not in the future
 *
 * @param closureDate - Closure date to validate
 * @throws {ValidationError} When closure date is in the future
 *
 * @example
 * ```typescript
 * validateClosureDate(new Date('2020-01-01')); // Valid (past)
 * validateClosureDate(new Date('2030-01-01')); // Throws error (future)
 * ```
 */
export const validateClosureDate = (closureDate: Date): void => {
  const date = new Date(closureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    throw new ValidationError(
      'Validation failed',
      'Closure date cannot be in the future'
    );
  }
};

/**
 * Validate UUID format
 *
 * @param id - UUID to validate
 * @param fieldName - Name of the field (for error message)
 * @throws {ValidationError} When UUID format is invalid
 *
 * @example
 * ```typescript
 * validateUuid('123e4567-e89b-12d3-a456-426614174000', 'Business ID'); // Valid
 * validateUuid('not-a-uuid', 'Business ID'); // Throws error
 * ```
 */
export const validateUuid = (id: string, fieldName: string = 'ID'): void => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a valid UUID`
    );
  }
};

/**
 * Check if business field should be validated
 * (only validates if the field is actually changing)
 *
 * @param currentValue - Current field value
 * @param newValue - New field value
 * @returns True if validation should be performed
 *
 * @example
 * ```typescript
 * const shouldValidate = shouldValidateField('test@example.com', 'new@example.com');
 * // Returns: true (value is changing)
 *
 * const shouldValidate = shouldValidateField('test@example.com', 'test@example.com');
 * // Returns: false (value is not changing)
 * ```
 */
export const shouldValidateField = (
  currentValue: string | undefined | null,
  newValue: string | undefined | null
): boolean => {
  // If both are falsy, no validation needed
  if (!currentValue && !newValue) return false;

  // If only one is falsy, validation needed
  if (!currentValue || !newValue) return true;

  // Compare normalized values
  return currentValue.trim() !== newValue.trim();
};

/**
 * Validate capital amount
 *
 * @param capital - Capital amount to validate
 * @throws {ValidationError} When capital is negative
 *
 * @example
 * ```typescript
 * validateCapital(50000); // Valid
 * validateCapital(-1000); // Throws error
 * ```
 */
export const validateCapital = (capital: number): void => {
  if (capital < 0) {
    throw new ValidationError(
      'Validation failed',
      'Capital must be a positive number'
    );
  }
};

/**
 * Validate currency code
 *
 * @param currency - Currency code to validate
 * @throws {ValidationError} When currency is invalid
 *
 * @example
 * ```typescript
 * validateCurrency('EUR'); // Valid
 * validateCurrency('XXX'); // Throws error
 * ```
 */
export const validateCurrency = (currency: string): void => {
  const validCurrencies = ['EUR', 'USD', 'GBP', 'CHF'];
  if (!validCurrencies.includes(currency)) {
    throw new ValidationError(
      'Validation failed',
      `Currency must be one of: ${validCurrencies.join(', ')}`
    );
  }
};
