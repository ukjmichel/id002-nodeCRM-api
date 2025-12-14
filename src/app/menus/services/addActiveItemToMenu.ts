/**
 * Add Active Item To Menu Service
 * Adds an item to a menu only if it's active in the option group
 */

import { NotFoundError } from '../../../core/errors/index.js';
import { ValidationError } from '../../../core/errors/ValidationError.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OptionGroupModel } from '../../item-options/models/option-group.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { MenuModel } from '../models/menu.model.js';

/**
 * Adds an item to a menu only if it's active in the specified option group
 *
 * @param menuId - The menu ID (MongoDB ObjectId or custom menuId)
 * @param optionId - The option group's optionId
 * @param itemId - The item UUID to add
 * @returns ApiResponse with the updated menu
 * @throws {ValidationError} When parameters are invalid or item is not active
 * @throws {NotFoundError} When menu, option group, or item not found
 *
 * @example
 * ```typescript
 * const result = await addActiveItemToMenu(
 *   'lunch-menu',
 *   'size-options',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * ```
 */
export async function addActiveItemToMenu(
  menuId: string,
  optionId: string,
  itemId: string
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

  if (!itemId || typeof itemId !== 'string') {
    throw new ValidationError(
      'Invalid itemId',
      'Item ID is required and must be a string'
    );
  }

  // Find the option group
  const optionGroup = await OptionGroupModel.findOne({ optionId });

  if (!optionGroup) {
    throw new NotFoundError(
      `Option group with optionId '${optionId}' not found`
    );
  }

  // Find the item in the option group
  const optionItem = optionGroup.items.find((item) => item.itemId === itemId);

  if (!optionItem) {
    throw new NotFoundError(
      `Item '${itemId}' not found in option group '${optionId}'`
    );
  }

  // Check if item is active
  if (!optionItem.active) {
    throw new ValidationError(
      'Item not active',
      `Item '${itemId}' is not active in option group '${optionId}'`
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

  // Check if item already exists in menu
  const existingItem = menu.items?.find((item) => item.itemId === itemId);
  if (existingItem) {
    throw new ValidationError(
      'Duplicate item',
      `Item '${itemId}' already exists in menu '${menuId}'`
    );
  }

  // Add the item to the menu
  if (!menu.items) {
    menu.items = [];
  }

  menu.items.push({
    itemId,
    quantity: 1,
    allowOptions: true,
    sortOrder: menu.items.length,
    active: true,
  });

  await menu.save();

  return {
    success: true,
    data: menu,
    message: 'Active item added to menu successfully',
  };
}
