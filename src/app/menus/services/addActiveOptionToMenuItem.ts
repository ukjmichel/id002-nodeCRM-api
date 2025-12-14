/**
 * Add Active Option To Menu Item Service
 * Adds an option group to a specific item in a menu, only if the option group has active items
 */

import { NotFoundError } from '../../../core/errors/index.js';
import { ValidationError } from '../../../core/errors/ValidationError.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OptionGroupModel } from '../../item-options/models/option-group.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * Adds an option group to a specific item in a menu, only if the option group has active items
 *
 * @param menuId - The menu ID (MongoDB ObjectId or custom menuId)
 * @param itemId - The item UUID within the menu
 * @param optionId - The option group's optionId to add
 * @returns ApiResponse with the updated menu
 * @throws {ValidationError} When parameters are invalid or option group has no active items
 * @throws {NotFoundError} When menu, item, or option group not found
 *
 * @example
 * ```typescript
 * const result = await addActiveOptionToMenuItem(
 *   'lunch-menu',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   'size-options'
 * );
 * ```
 */
export async function addActiveOptionToMenuItem(
  menuId: string,
  itemId: string,
  optionId: string
): Promise<ApiResponse<IMenuDocument>> {
  if (!menuId || typeof menuId !== 'string') {
    throw new ValidationError(
      'Invalid menuId',
      'Menu ID is required and must be a string'
    );
  }

  if (!itemId || typeof itemId !== 'string') {
    throw new ValidationError(
      'Invalid itemId',
      'Item ID is required and must be a string'
    );
  }

  if (!optionId || typeof optionId !== 'string') {
    throw new ValidationError(
      'Invalid optionId',
      'Option ID is required and must be a string'
    );
  }

  // Find the option group
  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  // Check if option group has at least one active item
  const activeItems = optionGroup.items.filter((item) => item.active);

  if (activeItems.length === 0) {
    throw new ValidationError(
      'No active items',
      `Option group '${optionId}' has no active items`
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

  // Find the item in the menu
  const menuItem = menu.items?.find((item) => item.itemId === itemId);

  if (!menuItem) {
    throw new NotFoundError(`Item '${itemId}' not found in menu '${menuId}'`);
  }

  // Initialize optionIds array if not exists
  if (!menuItem.optionIds) {
    menuItem.optionIds = [];
  }

  // Check if option already exists on this item
  if (menuItem.optionIds.includes(optionId)) {
    throw new ValidationError(
      'Duplicate option',
      `Option '${optionId}' already exists on item '${itemId}'`
    );
  }

  // Add the option to the item
  menuItem.optionIds.push(optionId);

  await menu.save();

  return {
    success: true,
    data: menu,
    message: `Option '${optionId}' with ${activeItems.length} active items added to item '${itemId}'`,
  };
}
