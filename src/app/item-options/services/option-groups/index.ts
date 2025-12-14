/**
 * =============================================================================
 * Option Group Service - Main Export
 * =============================================================================
 * Combines all option group service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import {
  IOptionGroup,
  IOptionGroupDocument,
  IOptionGroupItem,
  CreateOptionGroupInput,
  UpdateOptionGroupInput,
} from '../../interfaces/option-group.interface.js';
import { FilterQuery } from 'mongoose';

// =========================================================================
// Import CRUD Methods
// =========================================================================
import { createOptionGroup } from './createOptionGroup.js';
import {
  findAllOptionGroups,
  FindAllOptionGroupsOptions,
} from './findAllOptionGroups.js';
import { findOptionGroupById } from './findOptionGroupById.js';
import { findOneOptionGroup } from './findOneOptionGroup.js';
import { updateOptionGroup } from './updateOptionGroup.js';
import { deleteOptionGroup } from './deleteOptionGroup.js';
import {
  bulkCreateOptionGroups,
  BulkCreateResult,
} from './bulkCreateOptionGroups.js';
import { countOptionGroups } from './countOptionGroups.js';

// =========================================================================
// Import Find Methods
// =========================================================================
import { findByOptionId } from './findByOptionId.js';
import { findByItemId } from './findByItemId.js';
import { getOptionGroupsByItems } from './getOptionGroupsByItems.js';
import { existsByOptionId } from './existsByOptionId.js';

// =========================================================================
// Import Item Management Methods
// =========================================================================
import { addItemToOptionGroup } from './addItemToOptionGroup.js';
import { addMultipleItemsToOptionGroup } from './addMultipleItemsToOptionGroup.js';
import { removeItemFromOptionGroup } from './removeItemFromOptionGroup.js';
import { removeMultipleItemsFromOptionGroup } from './removeMultipleItemsFromOptionGroup.js';
import { clearAllItems } from './clearAllItems.js';
import { replaceAllItems } from './replaceAllItems.js';

// =========================================================================
// Import Query Methods
// =========================================================================
import { hasItem } from './hasItem.js';
import { getItemCount } from './getItemCount.js';
import { getActiveItems } from './getActiveItems.js';
import { getInactiveItems } from './getInactiveItems.js';
import { getAllItems } from './getAllItems.js';
import { getItemDetails } from './getItemDetails.js';
import { getActiveItemCount } from './getActiveItemCount.js';
import { getItemIds, GetItemIdsOptions } from './getItemIds.js';

// =========================================================================
// Import Update Methods
// =========================================================================
import { updateOptionGroupDescription } from './updateOptionGroupDescription.js';
import { updateOptionGroupByOptionId } from './updateOptionGroupByOptionId.js';
import { deleteOptionGroupByOptionId } from './deleteOptionGroupByOptionId.js';
import { updateItemMaxQuantity } from './updateItemMaxQuantity.js';
import { setItemActiveStatus } from './setItemActiveStatus.js';
import { bulkUpdateItems, BulkUpdateItemInput } from './bulkUpdateItems.js';
import { activateAllItems } from './activateAllItems.js';
import { deactivateAllItems } from './deactivateAllItems.js';

// =========================================================================
// Import Validation Methods
// =========================================================================
import { validateItemId } from './validateItemId.js';

/**
 * Option Group Service Interface
 */
export interface IOptionGroupService {
  // CRUD Operations
  create(
    data: CreateOptionGroupInput
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  findAll(
    options?: FindAllOptionGroupsOptions
  ): Promise<ApiResponse<IOptionGroupDocument[]>>;
  findById(id: string): Promise<ApiResponse<IOptionGroupDocument>>;
  findOne(
    filter: FilterQuery<IOptionGroupDocument>
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  update(
    id: string,
    data: UpdateOptionGroupInput
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  delete(id: string): Promise<ApiResponse<void>>;
  bulkCreate(
    optionGroups: CreateOptionGroupInput[]
  ): Promise<ApiResponse<BulkCreateResult>>;
  count(
    filter?: FilterQuery<IOptionGroupDocument>
  ): Promise<ApiResponse<number>>;

  // Find Methods
  findByOptionId(optionId: string): Promise<ApiResponse<IOptionGroupDocument>>;
  findByItemId(itemId: string): Promise<ApiResponse<IOptionGroupDocument[]>>;
  getOptionGroupsByItems(
    itemIds: string[]
  ): Promise<ApiResponse<IOptionGroupDocument[]>>;
  existsByOptionId(optionId: string): Promise<ApiResponse<boolean>>;

  // Update/Delete by optionId
  updateByOptionId(
    optionId: string,
    data: UpdateOptionGroupInput
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  deleteByOptionId(optionId: string): Promise<ApiResponse<void>>;
  updateDescription(
    optionId: string,
    description: string
  ): Promise<ApiResponse<IOptionGroupDocument>>;

  // Item Management Methods
  addItem(
    optionId: string,
    itemId: string,
    maxQuantity?: number,
    active?: boolean
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  addMultipleItems(
    optionId: string,
    itemIds: string[],
    defaultMaxQuantity?: number,
    defaultActive?: boolean
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  removeItem(
    optionId: string,
    itemId: string
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  removeMultipleItems(
    optionId: string,
    itemIds: string[]
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  clearAllItems(optionId: string): Promise<ApiResponse<IOptionGroupDocument>>;
  replaceAllItems(
    optionId: string,
    itemIds: string[],
    defaultMaxQuantity?: number,
    defaultActive?: boolean
  ): Promise<ApiResponse<IOptionGroupDocument>>;

  // Item Query Methods
  hasItem(optionId: string, itemId: string): Promise<ApiResponse<boolean>>;
  getItemCount(optionId: string): Promise<ApiResponse<number>>;
  getActiveItemCount(optionId: string): Promise<ApiResponse<number>>;
  getActiveItems(optionId: string): Promise<ApiResponse<IOptionGroupItem[]>>;
  getInactiveItems(optionId: string): Promise<ApiResponse<IOptionGroupItem[]>>;
  getAllItems(optionId: string): Promise<ApiResponse<IOptionGroupItem[]>>;
  getItemDetails(
    optionId: string,
    itemId: string
  ): Promise<ApiResponse<IOptionGroupItem>>;
  getItemIds(
    optionId: string,
    options?: GetItemIdsOptions
  ): Promise<ApiResponse<string[]>>;

  // Item Update Methods
  updateItemMaxQuantity(
    optionId: string,
    itemId: string,
    maxQuantity: number
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  setItemActiveStatus(
    optionId: string,
    itemId: string,
    active: boolean
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  bulkUpdateItems(
    optionId: string,
    updates: BulkUpdateItemInput[]
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  activateAllItems(
    optionId: string
  ): Promise<ApiResponse<IOptionGroupDocument>>;
  deactivateAllItems(
    optionId: string
  ): Promise<ApiResponse<IOptionGroupDocument>>;

  // Validation Methods
  validateItemId(itemId: string): boolean;
}

/**
 * Option Group Service
 * Provides all CRUD operations and option group-specific business logic
 *
 * @example
 * ```typescript
 * import { OptionGroupService } from './services/option-group';
 *
 * // Create a new option group
 * const newGroup = await OptionGroupService.create({
 *   optionId: 'size-options',
 *   description: 'Size options for beverages',
 *   items: []
 * });
 *
 * // Add items to the option group
 * await OptionGroupService.addMultipleItems(
 *   'size-options',
 *   ['uuid-1', 'uuid-2'],
 *   5,    // maxQuantity
 *   true  // active
 * );
 *
 * // Find all option groups for a specific item
 * const groups = await OptionGroupService.findByItemId('uuid-1');
 *
 * // Check if an option group contains an item
 * const hasItem = await OptionGroupService.hasItem('size-options', 'uuid-1');
 *
 * // Update option group description
 * await OptionGroupService.updateDescription('size-options', 'Updated description');
 *
 * // Bulk update multiple items
 * await OptionGroupService.bulkUpdateItems('size-options', [
 *   { itemId: 'uuid-1', maxQuantity: 5 },
 *   { itemId: 'uuid-2', active: false },
 * ]);
 * ```
 */
export const OptionGroupService: IOptionGroupService = {
  // CRUD Operations
  create: createOptionGroup,
  findAll: findAllOptionGroups,
  findById: findOptionGroupById,
  findOne: findOneOptionGroup,
  update: updateOptionGroup,
  delete: deleteOptionGroup,
  bulkCreate: bulkCreateOptionGroups,
  count: countOptionGroups,

  // Find Methods
  findByOptionId,
  findByItemId,
  getOptionGroupsByItems,
  existsByOptionId,

  // Update/Delete by optionId
  updateByOptionId: updateOptionGroupByOptionId,
  deleteByOptionId: deleteOptionGroupByOptionId,
  updateDescription: updateOptionGroupDescription,

  // Item Management Methods
  addItem: addItemToOptionGroup,
  addMultipleItems: addMultipleItemsToOptionGroup,
  removeItem: removeItemFromOptionGroup,
  removeMultipleItems: removeMultipleItemsFromOptionGroup,
  clearAllItems,
  replaceAllItems,

  // Item Query Methods
  hasItem,
  getItemCount,
  getActiveItemCount,
  getActiveItems,
  getInactiveItems,
  getAllItems,
  getItemDetails,
  getItemIds,

  // Item Update Methods
  updateItemMaxQuantity,
  setItemActiveStatus,
  bulkUpdateItems,
  activateAllItems,
  deactivateAllItems,

  // Validation Methods
  validateItemId,
};

export default OptionGroupService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================
export {
  // CRUD
  createOptionGroup,
  findAllOptionGroups,
  findOptionGroupById,
  findOneOptionGroup,
  updateOptionGroup,
  deleteOptionGroup,
  bulkCreateOptionGroups,
  countOptionGroups,
  // Find methods
  findByOptionId,
  findByItemId,
  getOptionGroupsByItems,
  existsByOptionId,
  // Update/Delete by optionId
  updateOptionGroupByOptionId,
  deleteOptionGroupByOptionId,
  updateOptionGroupDescription,
  // Item management
  addItemToOptionGroup,
  addMultipleItemsToOptionGroup,
  removeItemFromOptionGroup,
  removeMultipleItemsFromOptionGroup,
  clearAllItems,
  replaceAllItems,
  // Item query methods
  hasItem,
  getItemCount,
  getActiveItemCount,
  getActiveItems,
  getInactiveItems,
  getAllItems,
  getItemDetails,
  getItemIds,
  // Item update methods
  updateItemMaxQuantity,
  setItemActiveStatus,
  bulkUpdateItems,
  activateAllItems,
  deactivateAllItems,
  // Validation methods
  validateItemId,
};

// Re-export types
export type {
  FindAllOptionGroupsOptions,
  BulkCreateResult,
  BulkUpdateItemInput,
  GetItemIdsOptions,
};
export type {
  IOptionGroup,
  IOptionGroupDocument,
  IOptionGroupItem,
  CreateOptionGroupInput,
  UpdateOptionGroupInput,
} from '../../interfaces/option-group.interface.js';
