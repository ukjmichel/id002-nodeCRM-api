/**
 * Get Active Options For Menu Service
 * Retrieves all option groups linked to a menu that have at least one active item
 */

import { NotFoundError, ValidationError } from "../../../core/errors/index.js";
import { ApiResponse } from "../../../core/interfaces/index.js";
import { OptionGroupModel } from "../../item-options/models/option-group.model.js";
import { IOptionGroupDocument } from "../../item-options/services/option-groups/index.js";
import { MenuModel } from "../models/menu.model.js";



/**
 * Active option group with menu context
 */
export interface ActiveOptionForMenu {
  optionId: string;
  description: string;
  required: boolean;
  sortOrder: number;
  activeItemCount: number;
  totalItemCount: number;
  items: Array<{
    itemId: string;
    maxQuantity: number;
    active: boolean;
  }>;
}

/**
 * Retrieves all option groups linked to a menu that have at least one active item
 *
 * @param menuId - The menu ID (MongoDB ObjectId or custom menuId)
 * @param includeInactiveItems - Whether to include inactive items in response (default: false)
 * @returns ApiResponse with array of active option groups
 * @throws {ValidationError} When menuId is invalid
 * @throws {NotFoundError} When menu not found
 *
 * @example
 * ```typescript
 * const result = await getActiveOptionsForMenu('lunch-menu');
 * console.log(result.data); // [{ optionId: 'size-options', activeItemCount: 3, ... }]
 * ```
 */
export async function getActiveOptionsForMenu(
  menuId: string,
  includeInactiveItems: boolean = false
): Promise<ApiResponse<ActiveOptionForMenu[]>> {
  if (!menuId || typeof menuId !== 'string') {
    throw new ValidationError(
      'Invalid menuId',
      'Menu ID is required and must be a string'
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

  // If no option groups, return empty array
  if (!menu.optionGroups || menu.optionGroups.length === 0) {
    return {
      success: true,
      data: [],
      count: 0,
      message: 'Menu has no option groups',
    };
  }

  // Get all option IDs from menu
  const optionIds = menu.optionGroups.map((og) => og.optionId);

  // Fetch all option groups
  const optionGroups = await OptionGroupModel.find({
    optionId: { $in: optionIds },
  });

  // Create a map for quick lookup
  const optionGroupMap = new Map<string, IOptionGroupDocument>(
    optionGroups.map((og) => [og.optionId, og])
  );

  // Build result with menu context
  const activeOptions: ActiveOptionForMenu[] = [];

  for (const menuOption of menu.optionGroups) {
    const optionGroup = optionGroupMap.get(menuOption.optionId);

    if (!optionGroup) {
      continue; // Option group not found, skip
    }

    // Filter active items
    const activeItems = optionGroup.items.filter((item) => item.active);

    // Only include option groups with at least one active item
    if (activeItems.length === 0) {
      continue;
    }

    activeOptions.push({
      optionId: optionGroup.optionId,
      description: optionGroup.description,
      required: menuOption.required || false,
      sortOrder: menuOption.sortOrder || 0,
      activeItemCount: activeItems.length,
      totalItemCount: optionGroup.items.length,
      items: includeInactiveItems
        ? optionGroup.items.map((item) => ({
            itemId: item.itemId,
            maxQuantity: item.maxQuantity,
            active: item.active,
          }))
        : activeItems.map((item) => ({
            itemId: item.itemId,
            maxQuantity: item.maxQuantity,
            active: item.active,
          })),
    });
  }

  // Sort by sortOrder
  activeOptions.sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    success: true,
    data: activeOptions,
    count: activeOptions.length,
    message: `Found ${activeOptions.length} active option groups for menu`,
  };
}
