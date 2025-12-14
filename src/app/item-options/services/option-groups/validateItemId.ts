/**
 * Validate Item ID Utility
 * Validates if a string is a valid UUID v4 format
 */

/**
 * UUID v4 regex pattern
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4 format
 *
 * @param itemId - The string to validate
 * @returns true if valid UUID v4, false otherwise
 *
 * @example
 * ```typescript
 * validateItemId('550e8400-e29b-41d4-a716-446655440001'); // true
 * validateItemId('invalid-uuid'); // false
 * validateItemId(''); // false
 * ```
 */
export function validateItemId(itemId: string): boolean {
  if (!itemId || typeof itemId !== 'string') {
    return false;
  }
  return UUID_V4_REGEX.test(itemId);
}
