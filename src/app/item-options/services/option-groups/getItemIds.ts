/**
 * Get Item IDs Service
 * Gets all item IDs from an option group
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError, ValidationError } from '../../../../core/errors/index.js';

/**
 * Options for getting item IDs
 */
export interface GetItemIdsOptions {
  activeOnly?: boolean;
}

/**
 * Gets all item IDs from an option group
 *
 * @param optionId - The custom optionId
 * @param options - Options (activeOnly)
 * @returns ApiResponse with array of item IDs
 * @throws {ValidationError} When optionId is invalid
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * // Get all item IDs
 * const result = await getItemIds('size-options');
 *
 * // Get only active item IDs
 * const result = await getItemIds('size-options', { activeOnly: true });
 * ```
 */
export async function getItemIds(
  optionId: string,
  options: GetItemIdsOptions = {}
): Promise<ApiResponse<string[]>> {
  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(`Option group with optionId '${optionId}' not found`);
  }

  let items = optionGroup.items;

  if (options.activeOnly) {
    items = items.filter((item) => item.active);
  }

  const itemIds = items.map((item) => item.itemId);

  return {
    success: true,
    data: itemIds,
    count: itemIds.length,
    message: `Found ${itemIds.length} item IDs`,
  };
}
