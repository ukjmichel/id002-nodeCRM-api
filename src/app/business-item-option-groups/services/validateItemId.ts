/**
 * Validate item ID format (UUID)
 */

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate if an item ID is in correct UUID format
 *
 * @param itemId - Item ID to validate
 * @returns True if valid UUID format, false otherwise
 *
 * @example
 * ```typescript
 * validateItemId('550e8400-e29b-41d4-a716-446655440001'); // true
 * validateItemId('invalid-uuid'); // false
 * validateItemId(''); // false
 * ```
 */
export const validateItemId = (itemId: string): boolean => {
  if (!itemId || typeof itemId !== 'string') {
    return false;
  }

  return UUID_REGEX.test(itemId.trim());
};
