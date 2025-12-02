/**
 * =============================================================================
 * Menu Service - Main Export
 * =============================================================================
 * Combines all menu service methods into a single service object.
 * Each custom method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import { MenuModel } from '../models/menu.model.js';
import {
  IMenu,
  IMenuDocument,
  IMenuItem,
} from '../interfaces/menu.interface.js';

// Import custom service methods - Find methods
import { findByMenuId } from './findByMenuId.js';
import { findByItemId } from './findByItemId.js';
import { findByName } from './findByName.js';
import { getMenusByItems } from './getMenusByItems.js';

// Import custom service methods - Item management
import { addItemToMenu } from './addItemToMenu.js';
import { addMultipleItemsToMenu } from './addMultipleItemsToMenu.js';
import { removeItemFromMenu } from './removeItemFromMenu.js';
import { removeMultipleItemsFromMenu } from './removeMultipleItemsFromMenu.js';
import { clearAllItems } from './clearAllItems.js';
import { replaceAllItems } from './replaceAllItems.js';

// Import custom service methods - Query methods
import { hasItem } from './hasItem.js';
import { getItemCount } from './getItemCount.js';
import { getItemDetails } from './getItemDetails.js';

// Import custom service methods - Update methods
import { updateMenuName } from './updateMenuName.js';
import { updateMenuDescription } from './updateMenuDescription.js';
import { updateItemQuantity } from './updateItemQuantity.js';
import { bulkUpdateItems, BulkUpdateMenuItemInput } from './bulkUpdateItems.js';

// Import custom service methods - Active options management
import { addActiveOption } from './addActiveOption.js';
import { removeActiveOption } from './removeActiveOption.js';
import { getActiveOptions } from './getActiveOptions.js';
import { setActiveOptions } from './setActiveOptions.js';

// Import custom service methods - Default items management
import { addDefaultItem } from './addDefaultItem.js';
import { removeDefaultItem } from './removeDefaultItem.js';
import { getDefaultItems } from './getDefaultItems.js';
import { setDefaultItems } from './setDefaultItems.js';

// Import validation methods
import { validateItemId } from './validateItemId.js';

import createMongooseCrudService, {
  ApiResponse,
  IMongooseCrudService,
} from '../../../core/utils/mongooseCrudServiceGenerator.js';

/**
 * Extended Menu Service Interface
 * Includes standard CRUD operations plus custom business logic methods
 */
export interface IMenuService extends IMongooseCrudService<IMenu> {
  // =========================================================================
  // Find Methods
  // =========================================================================
  findByMenuId(menuId: string): Promise<ApiResponse<IMenuDocument>>;
  findByItemId(itemId: string): Promise<ApiResponse<IMenuDocument[]>>;
  findByName(name: string): Promise<ApiResponse<IMenuDocument[]>>;
  getMenusByItems(itemIds: string[]): Promise<ApiResponse<IMenuDocument[]>>;

  // =========================================================================
  // Item Management Methods
  // =========================================================================
  addItemToMenu(
    menuId: string,
    itemId: string,
    quantity?: number,
    activeOptions?: string[],
    defaultItems?: string[]
  ): Promise<ApiResponse<IMenuDocument>>;
  addMultipleItemsToMenu(
    menuId: string,
    itemIds: string[],
    defaultQuantity?: number,
    defaultActiveOptions?: string[],
    defaultDefaultItems?: string[]
  ): Promise<ApiResponse<IMenuDocument>>;
  removeItemFromMenu(
    menuId: string,
    itemId: string
  ): Promise<ApiResponse<IMenuDocument>>;
  removeMultipleItemsFromMenu(
    menuId: string,
    itemIds: string[]
  ): Promise<ApiResponse<IMenuDocument>>;
  clearAllItems(menuId: string): Promise<ApiResponse<IMenuDocument>>;
  replaceAllItems(
    menuId: string,
    itemIds: string[],
    defaultQuantity?: number,
    defaultActiveOptions?: string[],
    defaultDefaultItems?: string[]
  ): Promise<ApiResponse<IMenuDocument>>;

  // =========================================================================
  // Query Methods
  // =========================================================================
  hasItem(menuId: string, itemId: string): Promise<ApiResponse<boolean>>;
  getItemCount(menuId: string): Promise<ApiResponse<number>>;
  getItemDetails(menuId: string, itemId: string): Promise<ApiResponse<IMenuItem>>;

  // =========================================================================
  // Update Methods
  // =========================================================================
  updateMenuName(
    menuId: string,
    name: string
  ): Promise<ApiResponse<IMenuDocument>>;
  updateMenuDescription(
    menuId: string,
    description: string
  ): Promise<ApiResponse<IMenuDocument>>;
  updateItemQuantity(
    menuId: string,
    itemId: string,
    quantity: number
  ): Promise<ApiResponse<IMenuDocument>>;
  bulkUpdateItems(
    menuId: string,
    updates: BulkUpdateMenuItemInput[]
  ): Promise<ApiResponse<IMenuDocument>>;

  // =========================================================================
  // Active Options Methods
  // =========================================================================
  addActiveOption(
    menuId: string,
    itemId: string,
    optionId: string
  ): Promise<ApiResponse<IMenuDocument>>;
  removeActiveOption(
    menuId: string,
    itemId: string,
    optionId: string
  ): Promise<ApiResponse<IMenuDocument>>;
  getActiveOptions(
    menuId: string,
    itemId: string
  ): Promise<ApiResponse<string[]>>;
  setActiveOptions(
    menuId: string,
    itemId: string,
    optionIds: string[]
  ): Promise<ApiResponse<IMenuDocument>>;

  // =========================================================================
  // Default Items Methods
  // =========================================================================
  addDefaultItem(
    menuId: string,
    itemId: string,
    defaultItemId: string
  ): Promise<ApiResponse<IMenuDocument>>;
  removeDefaultItem(
    menuId: string,
    itemId: string,
    defaultItemId: string
  ): Promise<ApiResponse<IMenuDocument>>;
  getDefaultItems(
    menuId: string,
    itemId: string
  ): Promise<ApiResponse<string[]>>;
  setDefaultItems(
    menuId: string,
    itemId: string,
    defaultItemIds: string[]
  ): Promise<ApiResponse<IMenuDocument>>;

  // =========================================================================
  // Validation Methods
  // =========================================================================
  validateItemId(itemId: string): boolean;
}

/**
 * Create base CRUD service using the generic generator
 * Use 'as any' to bypass type checking for the model with custom static methods
 */
const baseCrudService = createMongooseCrudService<IMenu>(
  MenuModel as any,
  'Menu'
);

/**
 * Menu Service
 * Provides all CRUD operations and menu-specific business logic
 *
 * @example
 * ```typescript
 * import { MenuService } from './services/menu';
 *
 * // Create a new menu
 * const newMenu = await MenuService.create({
 *   menuId: 'lunch-menu-001',
 *   name: 'Lunch Menu',
 *   description: 'Daily lunch specials',
 *   items: []
 * });
 *
 * // Add items to the menu with custom settings
 * await MenuService.addMultipleItemsToMenu(
 *   'lunch-menu-001',
 *   [
 *     '550e8400-e29b-41d4-a716-446655440001',
 *     '550e8400-e29b-41d4-a716-446655440002'
 *   ],
 *   2,    // quantity
 *   ['size-option'],  // activeOptions
 *   []    // defaultItems
 * );
 *
 * // Find all menus for a specific item
 * const menus = await MenuService.findByItemId(
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Check if a menu contains an item
 * const hasItem = await MenuService.hasItem(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 *
 * // Update menu name
 * await MenuService.updateMenuName(
 *   'lunch-menu-001',
 *   'Updated Lunch Menu'
 * );
 *
 * // Update item quantity
 * await MenuService.updateItemQuantity(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   5
 * );
 *
 * // Bulk update multiple items
 * await MenuService.bulkUpdateItems('lunch-menu-001', [
 *   { itemId: '550e8400-e29b-41d4-a716-446655440001', quantity: 5 },
 *   { itemId: '550e8400-e29b-41d4-a716-446655440002', activeOptions: ['size'] },
 * ]);
 *
 * // Add active option to an item
 * await MenuService.addActiveOption(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   'size-option'
 * );
 *
 * // Add default item
 * await MenuService.addDefaultItem(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001',
 *   '550e8400-e29b-41d4-a716-446655440099'
 * );
 *
 * // Get all active options for an item
 * const activeOptions = await MenuService.getActiveOptions(
 *   'lunch-menu-001',
 *   '550e8400-e29b-41d4-a716-446655440001'
 * );
 * ```
 */
export const MenuService: IMenuService = {
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
  findByMenuId,
  findByItemId,
  findByName,
  getMenusByItems,

  // =========================================================================
  // Item Management Methods
  // =========================================================================
  addItemToMenu,
  addMultipleItemsToMenu,
  removeItemFromMenu,
  removeMultipleItemsFromMenu,
  clearAllItems,
  replaceAllItems,

  // =========================================================================
  // Query Methods
  // =========================================================================
  hasItem,
  getItemCount,
  getItemDetails,

  // =========================================================================
  // Update Methods
  // =========================================================================
  updateMenuName,
  updateMenuDescription,
  updateItemQuantity,
  bulkUpdateItems,

  // =========================================================================
  // Active Options Methods
  // =========================================================================
  addActiveOption,
  removeActiveOption,
  getActiveOptions,
  setActiveOptions,

  // =========================================================================
  // Default Items Methods
  // =========================================================================
  addDefaultItem,
  removeDefaultItem,
  getDefaultItems,
  setDefaultItems,

  // =========================================================================
  // Validation Methods
  // =========================================================================
  validateItemId,
};

export default MenuService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // Find methods
  findByMenuId,
  findByItemId,
  findByName,
  getMenusByItems,

  // Item management
  addItemToMenu,
  addMultipleItemsToMenu,
  removeItemFromMenu,
  removeMultipleItemsFromMenu,
  clearAllItems,
  replaceAllItems,

  // Query methods
  hasItem,
  getItemCount,
  getItemDetails,

  // Update methods
  updateMenuName,
  updateMenuDescription,
  updateItemQuantity,
  bulkUpdateItems,

  // Active options methods
  addActiveOption,
  removeActiveOption,
  getActiveOptions,
  setActiveOptions,

  // Default items methods
  addDefaultItem,
  removeDefaultItem,
  getDefaultItems,
  setDefaultItems,

  // Validation methods
  validateItemId,
};

// Re-export types and interfaces
export type { IMenu, IMenuDocument, IMenuItem } from '../interfaces/menu.interface.js';

export type { BulkUpdateMenuItemInput } from './bulkUpdateItems.js';
