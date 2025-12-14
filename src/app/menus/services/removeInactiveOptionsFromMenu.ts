/**
 * Remove Inactive Options From Menu Service
 * Removes option groups from a menu that have no active items
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { MenuModel } from '../models/menu.model.js';
import { IMenuDocument } from '../interfaces/menu.interface.js';
import { OptionGroupModel } from '../../item-options/models/option-group.model.js';


/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Result of removing inactive options
 */
export interface RemoveInactiveOptionsResult {
  menu: IMenuDocument;
  removed: string[];
  kept: string[];
}

/**
 * Removes option groups from a menu that have no active items
 *
 * @param id - Menu MongoDB _id or custom menuId
 * @returns ApiResponse with removal results
 * @throws {ValidationError} When id is invalid
 * @throws {NotFoundError} When menu not found
 *
 * @example
 * ```typescript
 * const result = await removeInactiveOptionsFromMenu('507f1f77bcf86cd799439011');
 * console.log(`Removed ${result.data.removed.length} inactive option groups`);
 * ```
 */
export async function removeInactiveOptionsFromMenu(
  id: string
): Promise<ApiResponse<RemoveInactiveOptionsResult>> {
  try {
    // ========================================================================
    // STEP 1: VALIDATE INPUT
    // ========================================================================

    if (!id || typeof id !== 'string') {
      throw new ValidationError(
        'Validation failed',
        'Menu ID is required and must be a string'
      );
    }

    // ========================================================================
    // STEP 2: FIND MENU
    // ========================================================================

    let menu: IMenuDocument | null = null;

    // Try to find by MongoDB _id first
    if (OBJECT_ID_REGEX.test(id)) {
      menu = await MenuModel.findById(id);
    }

    // If not found, try by custom menuId field
    if (!menu) {
      menu = await MenuModel.findOne({ menuId: id });
    }

    if (!menu) {
      throw new NotFoundError(`Menu with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: CHECK IF MENU HAS OPTION GROUPS
    // ========================================================================

    if (!menu.optionGroups || menu.optionGroups.length === 0) {
      return {
        success: true,
        data: {
          menu,
          removed: [],
          kept: [],
        },
        message: 'Menu has no option groups',
      };
    }

    // ========================================================================
    // STEP 4: FETCH OPTION GROUPS
    // ========================================================================

    const optionIds = menu.optionGroups.map((og) => og.optionId);

    const optionGroups = await OptionGroupModel.find({
      optionId: { $in: optionIds },
    });

    // ========================================================================
    // STEP 5: CREATE OPTION GROUP MAP
    // ========================================================================

    const optionGroupMap = new Map(optionGroups.map((og) => [og.optionId, og]));

    // ========================================================================
    // STEP 6: DETERMINE WHICH TO KEEP AND REMOVE
    // ========================================================================

    const kept: string[] = [];
    const removed: string[] = [];

    for (const menuOption of menu.optionGroups) {
      const optionGroup = optionGroupMap.get(menuOption.optionId);

      // If option group not found, mark for removal
      if (!optionGroup) {
        removed.push(menuOption.optionId);
        continue;
      }

      // Check if option group has active items
      const hasActiveItems = optionGroup.items.some((item) => item.active);

      if (hasActiveItems) {
        kept.push(menuOption.optionId);
      } else {
        removed.push(menuOption.optionId);
      }
    }

    // ========================================================================
    // STEP 7: UPDATE MENU IF NEEDED
    // ========================================================================

    if (removed.length > 0) {
      const removedSet = new Set(removed);
      menu.optionGroups = menu.optionGroups.filter(
        (og) => !removedSet.has(og.optionId)
      );
      await menu.save();
    }

    return {
      success: true,
      data: {
        menu,
        removed,
        kept,
      },
      message: `Removed ${removed.length} inactive option group(s), kept ${kept.length}`,
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error removing inactive options from menu',
      error instanceof Error ? error.message : String(error)
    );
  }
}
