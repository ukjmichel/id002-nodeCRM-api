/**
 * =============================================================================
 * Item Option Service - Main Export
 * =============================================================================
 * Service for managing relationships between Items (SQL) and OptionGroups (MongoDB).
 * This junction table service handles the many-to-many relationship between
 * Items (Sequelize) and OptionGroups (Mongoose).
 * =============================================================================
 */

import {
  ItemOptionAttributes,
  ItemOptionCreationAttributes,
  AddOptionToItemInput,
  BulkAddOptionsToItemInput,
  UpdateItemOptionInput,
  ReplaceItemOptionsInput,
  ItemOptionOperationResult,
} from '../../interfaces/item-option.interface.js';
import { ApiResponse } from '../../../../core/interfaces/index.js';

// Import service methods
import { addOptionToItem } from './addOptionToItem.js';
import { bulkAddOptionsToItem } from './bulkAddOptionsToItem.js';
import { removeOptionFromItem } from './removeOptionFromItem.js';
import { removeAllOptionsFromItem } from './removeAllOptionsFromItem.js';
import { findOptionsByItemId } from './findOptionsByItemId.js';
import { findItemsByOptionId } from './findItemsByOptionId.js';
import { findItemOption } from './findItemOption.js';
import { updateItemOption } from './updateItemOption.js';
import { replaceItemOptions } from './replaceItemOptions.js';
import { hasOption } from './hasOption.js';
import { getOptionCount } from './getOptionCount.js';
import { getRequiredOptions } from './getRequiredOptions.js';
import { setOptionRequired } from './setOptionRequired.js';
import { updateSortOrder } from './updateSortOrder.js';
import { reorderOptions } from './reorderOptions.js';
import { ItemOptionModel } from '../../models/item-option.model.js';

/**
 * Item Option Service Interface
 */
export interface IItemOptionService {
  // Add/Create Methods
  addOptionToItem(
    input: AddOptionToItemInput
  ): Promise<ApiResponse<ItemOptionModel>>;
  bulkAddOptionsToItem(
    input: BulkAddOptionsToItemInput
  ): Promise<ApiResponse<ItemOptionModel[]>>;

  // Remove Methods
  removeOptionFromItem(
    itemId: string,
    optionId: string
  ): Promise<ApiResponse<ItemOptionOperationResult>>;
  removeAllOptionsFromItem(
    itemId: string
  ): Promise<ApiResponse<ItemOptionOperationResult>>;

  // Find Methods
  findOptionsByItemId(itemId: string): Promise<ApiResponse<ItemOptionModel[]>>;
  findItemsByOptionId(
    optionId: string
  ): Promise<ApiResponse<ItemOptionModel[]>>;
  findItemOption(
    itemId: string,
    optionId: string
  ): Promise<ApiResponse<ItemOptionModel>>;

  // Update Methods
  updateItemOption(
    itemId: string,
    optionId: string,
    input: UpdateItemOptionInput
  ): Promise<ApiResponse<ItemOptionModel>>;
  replaceItemOptions(
    input: ReplaceItemOptionsInput
  ): Promise<ApiResponse<ItemOptionModel[]>>;
  setOptionRequired(
    itemId: string,
    optionId: string,
    isRequired: boolean
  ): Promise<ApiResponse<ItemOptionModel>>;
  updateSortOrder(
    itemId: string,
    optionId: string,
    sortOrder: number
  ): Promise<ApiResponse<ItemOptionModel>>;
  reorderOptions(
    itemId: string,
    optionIds: string[]
  ): Promise<ApiResponse<ItemOptionModel[]>>;

  // Query Methods
  hasOption(itemId: string, optionId: string): Promise<ApiResponse<boolean>>;
  getOptionCount(itemId: string): Promise<ApiResponse<number>>;
  getRequiredOptions(itemId: string): Promise<ApiResponse<ItemOptionModel[]>>;
}

/**
 * Item Option Service
 * Manages relationships between Items (SQL) and OptionGroups (MongoDB)
 *
 * @example
 * ```typescript
 * import { ItemOptionService } from './services/item-option';
 *
 * // Add an option to an item
 * const result = await ItemOptionService.addOptionToItem({
 *   itemId: '550e8400-e29b-41d4-a716-446655440001',
 *   optionId: '507f1f77bcf86cd799439011',
 *   sortOrder: 1,
 *   isRequired: true
 * });
 *
 * // Bulk add options to an item
 * await ItemOptionService.bulkAddOptionsToItem({
 *   itemId: '550e8400-e29b-41d4-a716-446655440001',
 *   options: [
 *     { optionId: '507f1f77bcf86cd799439011', sortOrder: 1, isRequired: true },
 *     { optionId: '507f1f77bcf86cd799439012', sortOrder: 2, isRequired: false }
 *   ]
 * });
 *
 * // Find all options for an item
 * const options = await ItemOptionService.findOptionsByItemId(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Check if item has an option
 * const hasOpt = await ItemOptionService.hasOption(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011'
 * );
 *
 * // Get required options
 * const required = await ItemOptionService.getRequiredOptions(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Reorder options
 * await ItemOptionService.reorderOptions(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439011']
 * );
 *
 * // Remove option from item
 * await ItemOptionService.removeOptionFromItem(
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '507f1f77bcf86cd799439011'
 * );
 * ```
 */
export const ItemOptionService: IItemOptionService = {
  // Add/Create Methods
  addOptionToItem,
  bulkAddOptionsToItem,

  // Remove Methods
  removeOptionFromItem,
  removeAllOptionsFromItem,

  // Find Methods
  findOptionsByItemId,
  findItemsByOptionId,
  findItemOption,

  // Update Methods
  updateItemOption,
  replaceItemOptions,
  setOptionRequired,
  updateSortOrder,
  reorderOptions,

  // Query Methods
  hasOption,
  getOptionCount,
  getRequiredOptions,
};

export default ItemOptionService;

// =============================================================================
// Re-export Individual Methods for Direct Imports
// =============================================================================

export {
  // Add/Create Methods
  addOptionToItem,
  bulkAddOptionsToItem,

  // Remove Methods
  removeOptionFromItem,
  removeAllOptionsFromItem,

  // Find Methods
  findOptionsByItemId,
  findItemsByOptionId,
  findItemOption,

  // Update Methods
  updateItemOption,
  replaceItemOptions,
  setOptionRequired,
  updateSortOrder,
  reorderOptions,

  // Query Methods
  hasOption,
  getOptionCount,
  getRequiredOptions,
};

// Re-export types and interfaces
export type {
  ItemOptionAttributes,
  ItemOptionCreationAttributes,
  AddOptionToItemInput,
  BulkAddOptionsToItemInput,
  UpdateItemOptionInput,
  ReplaceItemOptionsInput,
  ItemOptionOperationResult,
} from '../../interfaces/item-option.interface.js';
