/**
 * Validate item ID format (UUID)
 */

/**
 * Validate that an item ID is a valid UUID format
 *
 * @param itemId - Item ID to validate
 * @returns true if valid UUID format, false otherwise
 *
 * @example
 * ```typescript
 * validateItemId('550e8400-e29b-41d4-a716-446655440001'); // true
 * validateItemId('invalid-id'); // false
 * validateItemId(''); // false
 * ```
 */
export const validateItemId = (itemId: string): boolean => {
  if (!itemId || typeof itemId !== 'string') {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(itemId.trim());
};

export default validateItemId;
