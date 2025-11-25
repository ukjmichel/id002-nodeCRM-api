/**
 * =============================================================================
 * Business Item Option Group Service - Main Export
 * =============================================================================
 * Combines all business item option group service methods into a single service object.
 * Each custom method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
import {
  IBusinessItemOptionGroup,
  IBusinessItemOptionGroupDocument,
} from '../interfaces/business-item-option-group.interface';

// Import custom service methods
import { findByOptionId } from './findByOptionId';
import { findByItemId } from './findByItemId';
import { addItemToGroup } from './addItemToGroup';
import { removeItemFromGroup } from './removeItemFromGroup';
import { addMultipleItemsToGroup } from './addMultipleItemsToGroup';
import { removeMultipleItemsFromGroup } from './removeMultipleItemsFromGroup';
import { getGroupsByItems } from './getGroupsByItems';
import { validateItemId } from './validateItemId';
import { updateGroupDescription } from './updateGroupDescription';
import { getItemCount } from './getItemCount';
import { hasItem } from './hasItem';
import { clearAllItems } from './clearAllItems';
import { replaceAllItems } from './replaceAllItems';
import createMongooseCrudService, {
  ApiResponse,
  IMongooseCrudService,
} from '../../../core/utils/mongooseCrudServiceGenerator';

/**
 * Extended Business Item Option Group Service Interface
 * Includes standard CRUD operations plus custom business logic methods
 */
export interface IBusinessItemOptionGroupService
  extends IMongooseCrudService<IBusinessItemOptionGroup> {
  // Find methods
  findByOptionId(
    optionId: string
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;
  findByItemId(
    itemId: string
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument[]>>;
  getGroupsByItems(
    itemIds: string[]
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument[]>>;

  // Item management methods
  addItemToGroup(
    optionId: string,
    itemId: string
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;
  removeItemFromGroup(
    optionId: string,
    itemId: string
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;
  addMultipleItemsToGroup(
    optionId: string,
    itemIds: string[]
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;
  removeMultipleItemsFromGroup(
    optionId: string,
    itemIds: string[]
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;
  clearAllItems(
    optionId: string
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;
  replaceAllItems(
    optionId: string,
    itemIds: string[]
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;

  // Query methods
  hasItem(optionId: string, itemId: string): Promise<ApiResponse<boolean>>;
  getItemCount(optionId: string): Promise<ApiResponse<number>>;

  // Update methods
  updateGroupDescription(
    optionId: string,
    description: string
  ): Promise<ApiResponse<IBusinessItemOptionGroupDocument>>;

  // Validation methods
  validateItemId(itemId: string): boolean;
}

/**
 * Create base CRUD service using the generic generator
 * Use 'as any' to bypass type checking for the model with custom static methods
 */
const baseCrudService = createMongooseCrudService<IBusinessItemOptionGroup>(
  BusinessItemOptionGroupModel as any,
  'BusinessItemOptionGroup'
);

/**
 * Business Item Option Group Service
 * Provides all CRUD operations and option group-specific business logic
 *
 * @example
 * ```typescript
 * import { businessItemOptionGroupService } from './services/business-item-option-group';
 *
 * // Create a new option group
 * const newGroup = await businessItemOptionGroupService.create({
 *   optionId: 'size-options-001',
 *   description: 'Size options for beverages',
 *   items: []
 * });
 *
 * // Add items to the group
 * await businessItemOptionGroupService.addMultipleItemsToGroup(
 *   'size-options-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002'
 *   ]
 * );
 *
 * // Find all groups for a specific item
 * const groups = await businessItemOptionGroupService.findByItemId(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Check if a group contains an item
 * const hasItem = await businessItemOptionGroupService.hasItem(
 *   'size-options-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Update group description
 * await businessItemOptionGroupService.updateGroupDescription(
 *   'size-options-001',
 *   'Updated size options for all beverages'
 * );
 * ```
 */
export const businessItemOptionGroupService: IBusinessItemOptionGroupService = {
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
  findByOptionId: findByOptionId,
  findByItemId: findByItemId,
  getGroupsByItems: getGroupsByItems,

  // =========================================================================
  // Item Management Methods
  // =========================================================================
  addItemToGroup: addItemToGroup,
  removeItemFromGroup: removeItemFromGroup,
  addMultipleItemsToGroup: addMultipleItemsToGroup,
  removeMultipleItemsFromGroup: removeMultipleItemsFromGroup,
  clearAllItems: clearAllItems,
  replaceAllItems: replaceAllItems,

  // =========================================================================
  // Query Methods
  // =========================================================================
  hasItem: hasItem,
  getItemCount: getItemCount,

  // =========================================================================
  // Update Methods
  // =========================================================================
  updateGroupDescription: updateGroupDescription,

  // =========================================================================
  // Validation Methods
  // =========================================================================
  validateItemId: validateItemId,
};

export default businessItemOptionGroupService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // CRUD operations
  // Note: These are from the base service and can be imported directly if needed
  // Find methods
  findByOptionId,
  findByItemId,
  getGroupsByItems,

  // Item management
  addItemToGroup,
  removeItemFromGroup,
  addMultipleItemsToGroup,
  removeMultipleItemsFromGroup,
  clearAllItems,
  replaceAllItems,

  // Query methods
  hasItem,
  getItemCount,

  // Update methods
  updateGroupDescription,

  // Validation methods
  validateItemId,
};

// Re-export types and interfaces
export type { IBusinessItemOptionGroup } from '../interfaces/business-item-option-group.interface';
