/**
 * =============================================================================
 * Business Item Option Service - Main Export
 * =============================================================================
 * Combines all business item Option service methods into a single service object.
 * Each custom method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import { ItemOptionsModel } from '../models/item-option.model.js';
import {
  IItemOptions,
  IItemOptionsDocument,
  IOptionItem,
} from '../interfaces/item-option.interface.js';

// Import custom service methods
import { findByOptionId } from './findByOptionId.js';
import { findByItemId } from './findByItemId.js';
import { getOptionsByItems } from './getOptionsByItems.js';

import { addItemToOption } from './addItemToOption.js';
import { addMultipleItemsToOption } from './addMultipleItemsToOption.js';
import { removeItemFromOption } from './removeItemFromOption.js';
import { removeMultipleItemsFromOption } from './removeMultipleItemsFromOption.js';
import { clearAllItems } from './clearAllItems.js';
import { replaceAllItems } from './replaceAllItems.js';

import { hasItem } from './hasItem.js';
import { getItemCount } from './getItemCount.js';
import { getActiveItems } from './getActiveItems.js';
import { getItemDetails } from './getItemDetails.js';

import { updateOptionDescription } from './updateOptionDescription.js';
import { updateItemMaxQuantity } from './updateItemMaxQuantity.js';
import { setItemActiveStatus } from './setItemActiveStatus.js';
import { bulkUpdateItems, BulkUpdateItemInput } from './bulkUpdateItems.js';
import { activateAllItems } from './activateAllItems.js';
import { deactivateAllItems } from './deactivateAllItems.js';

import { validateItemId } from './validateItemId.js';

import createMongooseCrudService, {
  ApiResponse,
  IMongooseCrudService,
} from '../../../core/utils/mongooseCrudServiceGenerator.js';

/**
 * Extended Business Item Option Service Interface
 * Includes standard CRUD operations plus custom business logic methods
 */
export interface IItemOptionService extends IMongooseCrudService<IItemOptions> {
  // =========================================================================
  // Find Methods
  // =========================================================================
  findByOptionId(optionId: string): Promise<ApiResponse<IItemOptionsDocument>>;
  findByItemId(itemId: string): Promise<ApiResponse<IItemOptionsDocument[]>>;
  getOptionsByItems(
    itemIds: string[]
  ): Promise<ApiResponse<IItemOptionsDocument[]>>;

  // =========================================================================
  // Item Management Methods
  // =========================================================================
  addItemToOption(
    optionId: string,
    itemId: string,
    maxQuantity?: number,
    active?: boolean
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  addMultipleItemsToOption(
    optionId: string,
    itemIds: string[],
    defaultMaxQuantity?: number,
    defaultActive?: boolean
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  removeItemFromOption(
    optionId: string,
    itemId: string
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  removeMultipleItemsFromOption(
    optionId: string,
    itemIds: string[]
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  clearAllItems(optionId: string): Promise<ApiResponse<IItemOptionsDocument>>;
  replaceAllItems(
    optionId: string,
    itemIds: string[],
    defaultMaxQuantity?: number,
    defaultActive?: boolean
  ): Promise<ApiResponse<IItemOptionsDocument>>;

  // =========================================================================
  // Query Methods
  // =========================================================================
  hasItem(optionId: string, itemId: string): Promise<ApiResponse<boolean>>;
  getItemCount(optionId: string): Promise<ApiResponse<number>>;
  getActiveItems(optionId: string): Promise<ApiResponse<IOptionItem[]>>;
  getItemDetails(
    optionId: string,
    itemId: string
  ): Promise<ApiResponse<IOptionItem>>;

  // =========================================================================
  // Update Methods
  // =========================================================================
  updateOptionDescription(
    optionId: string,
    description: string
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  updateItemMaxQuantity(
    optionId: string,
    itemId: string,
    maxQuantity: number
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  setItemActiveStatus(
    optionId: string,
    itemId: string,
    active: boolean
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  bulkUpdateItems(
    optionId: string,
    updates: BulkUpdateItemInput[]
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  activateAllItems(
    optionId: string
  ): Promise<ApiResponse<IItemOptionsDocument>>;
  deactivateAllItems(
    optionId: string
  ): Promise<ApiResponse<IItemOptionsDocument>>;

  // =========================================================================
  // Validation Methods
  // =========================================================================
  validateItemId(itemId: string): boolean;
}

/**
 * Create base CRUD service using the generic generator
 * Use 'as any' to bypass type checking for the model with custom static methods
 */
const baseCrudService = createMongooseCrudService<IItemOptions>(
  ItemOptionsModel as any,
  'ItemOption'
);

/**
 * Business Item Option Service
 * Provides all CRUD operations and Option-specific business logic
 *
 * @example
 * ```typescript
 * import { ItemOptionService } from './services/item-option';
 *
 * // Create a new Option
 * const newOption = await ItemOptionService.create({
 *   optionId: 'size-options-001',
 *   description: 'Size options for beverages',
 *   items: []
 * });
 *
 * // Add items to the Option with custom settings
 * await ItemOptionService.addMultipleItemsToOption(
 *   'size-options-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002'
 *   ],
 *   5,    // maxQuantity
 *   true  // active
 * );
 *
 * // Find all Options for a specific item
 * const options = await ItemOptionService.findByItemId(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Check if an Option contains an item
 * const hasItem = await ItemOptionService.hasItem(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Update Option description
 * await ItemOptionService.updateOptionDescription(
 *   'size-options-001',
 *   'Updated size options for all beverages'
 * );
 *
 * // Update item max quantity
 * await ItemOptionService.updateItemMaxQuantity(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   10
 * );
 *
 * // Bulk update multiple items
 * await ItemOptionService.bulkUpdateItems('size-options-001', [
 *   { itemId: '550e8400-e29b-41d4-a716-446655440001', maxQuantity: 5 },
 *   { itemId: '550e8400-e29b-41d4-a716-446655440002', active: false },
 * ]);
 *
 * // Get all active items
 * const activeItems = await ItemOptionService.getActiveItems('size-options-001');
 * ```
 */
export const ItemOptionService: IItemOptionService = {
  // =========================================================================
  // Standard CRUD Operations (from base service)
  // =========================================================================
  create: baseCrudService.create,
  findAll: baseCrudService.findAll,
  findById: baseCrudService.findById,
  findOne: baseCrudService.findOne,
  update: baseCrudService.update,
  delete: baseCrudService.delete,
  bulkCreate: baseCrudService.bulkCreate,
  count: baseCrudService.count,

  // =========================================================================
  // Find Methods
  // =========================================================================
  findByOptionId,
  findByItemId,
  getOptionsByItems,

  // =========================================================================
  // Item Management Methods
  // =========================================================================
  addItemToOption,
  addMultipleItemsToOption,
  removeItemFromOption,
  removeMultipleItemsFromOption,
  clearAllItems,
  replaceAllItems,

  // =========================================================================
  // Query Methods
  // =========================================================================
  hasItem,
  getItemCount,
  getActiveItems,
  getItemDetails,

  // =========================================================================
  // Update Methods
  // =========================================================================
  updateOptionDescription,
  updateItemMaxQuantity,
  setItemActiveStatus,
  bulkUpdateItems,
  activateAllItems,
  deactivateAllItems,

  // =========================================================================
  // Validation Methods
  // =========================================================================
  validateItemId,
};

export default ItemOptionService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // Find methods
  findByOptionId,
  findByItemId,
  getOptionsByItems,

  // Item management
  addItemToOption,
  addMultipleItemsToOption,
  removeItemFromOption,
  removeMultipleItemsFromOption,
  clearAllItems,
  replaceAllItems,

  // Query methods
  hasItem,
  getItemCount,
  getActiveItems,
  getItemDetails,

  // Update methods
  updateOptionDescription,
  updateItemMaxQuantity,
  setItemActiveStatus,
  bulkUpdateItems,
  activateAllItems,
  deactivateAllItems,

  // Validation methods
  validateItemId,
};

// Re-export types and interfaces
export type {
  IItemOptions,
  IItemOptionsDocument,
  IOptionItem,
} from '../interfaces/item-option.interface.js';

export type { BulkUpdateItemInput } from './bulkUpdateItems.js';
