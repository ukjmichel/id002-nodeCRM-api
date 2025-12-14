/**
 * Add Active Option To Menu Service
 * Adds an option group to a menu only if it has at least one active item
 */

import { NotFoundError } from '../../../core/errors/index.js';
import { ValidationError } from '../../../core/errors/ValidationError.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OptionGroupModel } from '../../item-options/models/option-group.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * Adds an option group to a menu only if it has at least one active item
 *
 * @param menuId - The menu ID (MongoDB ObjectId or custom menuId)
 * @param optionId - The option group's optionId to add
 * @returns ApiResponse with the updated menu
 * @throws {ValidationError} When parameters are invalid or option group has no active items
 * @throws {NotFoundError} When menu or option group not found
 *
 * @example
 * ```typescript
 * const result = await addActiveOptionToMenu('lunch-menu', 'size-options');
 * ```
 */
export async function addActiveOptionToMenu(
  menuId: string,
  optionId: string
): Promise<ApiResponse<IMenuDocument>> {
  if (!menuId || typeof menuId !== 'string') {
    throw new ValidationError(
      'Invalid menuId',
      'Menu ID is required and must be a string'
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

  // Check if option group already exists in menu
  const existingOption = menu.optionGroups?.find(
    (og) => og.optionId === optionId
  );
  if (existingOption) {
    throw new ValidationError(
      'Duplicate option group',
      `Option group '${optionId}' already exists in menu '${menuId}'`
    );
  }

  // Add the option group to the menu
  if (!menu.optionGroups) {
    menu.optionGroups = [];
  }

  menu.optionGroups.push({
    optionId,
    sortOrder: menu.optionGroups.length,
    required: false,
  });

  await menu.save();

  return {
    success: true,
    data: menu,
    message: `Option group '${optionId}' with ${activeItems.length} active items added to menu`,
  };
}
