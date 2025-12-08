/**
 * Create Menu Service
 * Creates a new menu record with validation
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument, CreateMenuInput } from '../interfaces/menu.interface.js';

/**
 * Create a new menu
 *
 * @param data - Menu data to create
 * @returns Created menu record
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const newMenu = await createMenu({
 *   menuId: 'lunch-menu-001',
 *   name: 'Lunch Menu',
 *   description: 'Our delicious lunch offerings',
 *   items: [
 *     { itemId: 'uuid-1', quantity: 1, allowOptions: true }
 *   ]
 * });
 * ```
 */
export const createMenu = async (
  data: CreateMenuInput
): Promise<ApiResponse<IMenuDocument>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE REQUIRED FIELDS
    // ========================================================================

    if (!data.menuId) {
      throw new ValidationError('Validation failed', 'Menu ID is required');
    }

    if (!data.name) {
      throw new ValidationError('Validation failed', 'Menu name is required');
    }

    if (!data.description) {
      throw new ValidationError('Validation failed', 'Menu description is required');
    }

    // ========================================================================
    // STEP 2: CHECK FOR DUPLICATE MENU ID
    // ========================================================================

    const existingMenu = await MenuModel.findOne({ menuId: data.menuId });

    if (existingMenu) {
      throw new ValidationError(
        'Duplicate menu',
        `A menu with ID '${data.menuId}' already exists`
      );
    }

    // ========================================================================
    // STEP 3: CREATE MENU
    // ========================================================================

    const menu = new MenuModel({
      menuId: data.menuId,
      name: data.name,
      description: data.description,
      items: data.items || [],
    });

    // Pre-save hook will validate itemIds exist
    await menu.save();

    return {
      success: true,
      data: menu,
      message: 'Menu created successfully',
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
      throw new ValidationError('Validation failed', error.message);
    }

    throw new ValidationError(
      'Error creating Menu',
      error instanceof Error ? error.message : String(error)
    );
  }
};
