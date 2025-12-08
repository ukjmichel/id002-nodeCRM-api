/**
 * =============================================================================
 * UUID Validation Utility
 * =============================================================================
 * Provides UUID validation functions for use across the application.
 * Supports UUID v4 format validation.
 * =============================================================================
 */

import { ValidationError } from '../errors/index.js';

/**
 * UUID v4 validation regex pattern
 * Matches: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * Where x is a hexadecimal character (0-9, a-f, A-F)
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check if a string is a valid UUID format
 *
 * @param value - The string to validate
 * @returns True if the string is a valid UUID, false otherwise
 *
 * @example
 * ```typescript
 * isValidUuid('550e8400-e29b-41d4-a716-446655440000'); // true
 * isValidUuid('invalid-uuid'); // false
 * isValidUuid(''); // false
 * isValidUuid(null); // false
 * ```
 */
export const isValidUuid = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  return UUID_REGEX.test(value);
};

/**
 * Validate that a value is a valid UUID format
 * Throws ValidationError if the value is not a valid UUID
 *
 * @param value - The value to validate
 * @param fieldName - The name of the field (for error messages)
 * @throws {ValidationError} When the value is not a valid UUID
 *
 * @example
 * ```typescript
 * validateUuid('550e8400-e29b-41d4-a716-446655440000', 'Item ID'); // passes
 * validateUuid('invalid', 'Item ID'); // throws ValidationError
 * ```
 */
export const validateUuid = (
  value: unknown,
  fieldName: string = 'ID'
): void => {
  if (!value) {
    throw new ValidationError('Validation failed', `${fieldName} is required`);
  }

  if (typeof value !== 'string') {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a string`
    );
  }

  if (!UUID_REGEX.test(value)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a valid UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)`
    );
  }
};

/**
 * Validate multiple UUIDs at once
 * Throws ValidationError if any value is not a valid UUID
 *
 * @param values - Array of values to validate
 * @param fieldName - The name of the field (for error messages)
 * @throws {ValidationError} When any value is not a valid UUID
 *
 * @example
 * ```typescript
 * validateUuids(['uuid-1', 'uuid-2'], 'Item IDs'); // passes if all valid
 * validateUuids(['uuid-1', 'invalid'], 'Item IDs'); // throws ValidationError
 * ```
 */
export const validateUuids = (
  values: unknown[],
  fieldName: string = 'IDs'
): void => {
  if (!values || !Array.isArray(values)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be an array`
    );
  }

  const invalidUuids: string[] = [];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (!value) {
      throw new ValidationError(
        'Validation failed',
        `${fieldName}[${i}] cannot be empty`
      );
    }

    if (typeof value !== 'string') {
      throw new ValidationError(
        'Validation failed',
        `${fieldName}[${i}] must be a string`
      );
    }

    if (!UUID_REGEX.test(value)) {
      invalidUuids.push(value);
    }
  }

  if (invalidUuids.length > 0) {
    throw new ValidationError(
      'Validation failed',
      `Invalid UUID format for ${fieldName}: ${invalidUuids.join(', ')}`
    );
  }
};

/**
 * Extract valid UUIDs from an array, filtering out invalid ones
 * Does not throw errors, simply filters
 *
 * @param values - Array of potential UUIDs
 * @returns Array of valid UUIDs only
 *
 * @example
 * ```typescript
 * filterValidUuids(['valid-uuid', 'invalid', 'another-valid-uuid']);
 * // Returns only the valid UUIDs
 * ```
 */
export const filterValidUuids = (values: unknown[]): string[] => {
  if (!values || !Array.isArray(values)) {
    return [];
  }

  return values.filter(
    (value): value is string =>
      typeof value === 'string' && UUID_REGEX.test(value)
  );
};
