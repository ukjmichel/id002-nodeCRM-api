/**
 * Add Active Options To Menu Service
 * Adds multiple option groups to a menu, only those that have at least one active item
 */

import { NotFoundError } from '../../../core/errors/index.js';
import { ValidationError } from '../../../core/errors/ValidationError.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OptionGroupModel } from '../../item-options/models/option-group.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * Result of adding multiple active options
 */
export interface AddActiveOptionsResult {
  menu: IMenuDocument;
  added: string[];
  skippedNoActive: string[];
  skippedNotFound: string[];
  skippedDuplicate: string[];
}

/**
 * Adds multiple option groups to a menu, only those that have at least one active item
 *
 * @param menuId - The menu ID (MongoDB ObjectId or custom menuId)
 * @param optionIds - Array of option group optionIds to add
 * @param required - Whether the option groups should be required (default: false)
 * @returns ApiResponse with detailed results
 * @throws {ValidationError} When parameters are invalid
 * @throws {NotFoundError} When menu not found
 *
 * @example
 * ```typescript
 * const result = await addActiveOptionsToMenu(
 *   'lunch-menu',
 *   ['size-options', 'topping-options', 'sauce-options'],
 *   false
 * );
 * console.log(result.data.added); // ['size-options', 'topping-options']
 * console.log(result.data.skippedNoActive); // ['sauce-options']
 * ```
 */
export async function addActiveOptionsToMenu(
  menuId: string,
  optionIds: string[],
  required: boolean = false
): Promise<ApiResponse<AddActiveOptionsResult>> {
  if (!menuId || typeof menuId !== 'string') {
    throw new ValidationError(
      'Invalid menuId',
      'Menu ID is required and must be a string'
    );
  }

  if (!Array.isArray(optionIds) || optionIds.length === 0) {
    throw new ValidationError(
      'Invalid optionIds',
      'Option IDs array is required and must not be empty'
    );
  }

  // Find the menu (try by menuId field first, then by _id)
  let menu = await MenuModel.findOne({ menuId });
  if (!menu) {
    menu = await MenuModel.findById(menuId).catch(() => null);
  }

  if (!menu) {
    throw new NotFoundError(`Menu '${menuId}' not found`);
  }

  // Initialize optionGroups array if not exists
  if (!menu.optionGroups) {
    menu.optionGroups = [];
  }

  // Get existing option IDs in menu
  const existingOptionIds = new Set(menu.optionGroups.map((og) => og.optionId));

  // Find all requested option groups
  const optionGroups = await OptionGroupModel.find({
    optionId: { $in: optionIds },
  });

  // Create a map for quick lookup
  const optionGroupMap = new Map(optionGroups.map((og) => [og.optionId, og]));

  // Track results
  const added: string[] = [];
  const skippedNoActive: string[] = [];
  const skippedNotFound: string[] = [];
  const skippedDuplicate: string[] = [];

  // Process each optionId
  for (const optionId of optionIds) {
    // Check if already in menu
    if (existingOptionIds.has(optionId)) {
      skippedDuplicate.push(optionId);
      continue;
    }

    // Check if option group exists
    const optionGroup = optionGroupMap.get(optionId);
    if (!optionGroup) {
      skippedNotFound.push(optionId);
      continue;
    }

    // Check if has active items
    const hasActiveItems = optionGroup.items.some((item) => item.active);
    if (!hasActiveItems) {
      skippedNoActive.push(optionId);
      continue;
    }

    // Add to menu
    menu.optionGroups.push({
      optionId,
      sortOrder: menu.optionGroups.length,
      required,
    });

    added.push(optionId);
    existingOptionIds.add(optionId);
  }

  // Save if any were added
  if (added.length > 0) {
    await menu.save();
  }

  return {
    success: true,
    data: {
      menu,
      added,
      skippedNoActive,
      skippedNotFound,
      skippedDuplicate,
    },
    message: `Added ${added.length} option groups to menu`,
  };
}
