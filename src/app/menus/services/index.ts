/**
 * =============================================================================
 * Menu Service - Main Export
 * =============================================================================
 * Combines all menu service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import { ApiResponse } from '../../../core/interfaces/index.js';
import {
  IMenuDocument,
  IMenuItem,
  CreateMenuInput,
  UpdateMenuInput,
  AddMenuItemInput,
  BulkAddMenuItemsInput,
  UpdateMenuItemInput,
} from '../interfaces/menu.interface.js';
import { FilterQuery } from 'mongoose';

// Import all service methods
import { createMenu } from './createMenu.js';
import { findMenuById } from './findMenuById.js';
import { findMenuByMenuId } from './findMenuByMenuId.js';
import { findAllMenus, FindAllMenusOptions } from './findAllMenus.js';
import { findOneMenu } from './findOneMenu.js';
import { updateMenu } from './updateMenu.js';
import { deleteMenu } from './deleteMenu.js';
import { countMenus } from './countMenus.js';
import { findMenusByName } from './findMenusByName.js';
import { findMenusByItemId } from './findMenusByItemId.js';
import { addItemToMenu } from './addItemToMenu.js';
import { removeItemFromMenu } from './removeItemFromMenu.js';
import { updateMenuItem } from './updateMenuItem.js';
import { bulkAddItemsToMenu } from './bulkAddItemsToMenu.js';
import { clearMenuItems } from './clearMenuItems.js';
import { replaceMenuItems } from './replaceMenuItems.js';
import { getMenuItem } from './getMenuItem.js';
import { hasMenuItem } from './hasMenuItem.js';
import { getMenuItemCount } from './getMenuItemCount.js';
import { getItemsWithOptions } from './getItemsWithOptions.js';
import { getItemsWithoutOptions } from './getItemsWithoutOptions.js';

/**
 * Menu Service Interface
 */
export interface IMenuService {
  // CRUD Operations
  create(data: CreateMenuInput): Promise<ApiResponse<IMenuDocument>>;
  findById(id: string): Promise<ApiResponse<IMenuDocument>>;
  findByMenuId(menuId: string): Promise<ApiResponse<IMenuDocument>>;
  findAll(options?: FindAllMenusOptions): Promise<ApiResponse<IMenuDocument[]>>;
  findOne(filter: FilterQuery<IMenuDocument>): Promise<ApiResponse<IMenuDocument>>;
  update(id: string, data: UpdateMenuInput): Promise<ApiResponse<IMenuDocument>>;
  delete(id: string): Promise<ApiResponse<void>>;
  count(filter?: FilterQuery<IMenuDocument>): Promise<ApiResponse<number>>;

  // Search Operations
  findByName(name: string): Promise<ApiResponse<IMenuDocument[]>>;
  findByItemId(itemId: string): Promise<ApiResponse<IMenuDocument[]>>;

  // Item Management
  addItem(id: string, input: AddMenuItemInput): Promise<ApiResponse<IMenuDocument>>;
  removeItem(id: string, itemId: string): Promise<ApiResponse<IMenuDocument>>;
  updateItem(
    id: string,
    itemId: string,
    input: UpdateMenuItemInput
  ): Promise<ApiResponse<IMenuDocument>>;
  bulkAddItems(
    id: string,
    input: BulkAddMenuItemsInput
  ): Promise<ApiResponse<IMenuDocument>>;
  clearItems(id: string): Promise<ApiResponse<IMenuDocument>>;
  replaceItems(
    id: string,
    items: AddMenuItemInput[]
  ): Promise<ApiResponse<IMenuDocument>>;

  // Item Query Operations
  getItem(id: string, itemId: string): Promise<ApiResponse<IMenuItem>>;
  hasItem(id: string, itemId: string): Promise<ApiResponse<boolean>>;
  getItemCount(id: string): Promise<ApiResponse<number>>;
  getItemsWithOptions(id: string): Promise<ApiResponse<IMenuItem[]>>;
  getItemsWithoutOptions(id: string): Promise<ApiResponse<IMenuItem[]>>;
}

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
 *   description: 'Our delicious lunch offerings',
 *   items: [
 *     { itemId: 'uuid-1', quantity: 1, allowOptions: true }
 *   ]
 * });
 *
 * // Add an item to a menu
 * await MenuService.addItem('mongo-id', {
 *   itemId: 'uuid-2',
 *   quantity: 2,
 *   allowOptions: false
 * });
 *
 * // Find menus containing an item
 * const menus = await MenuService.findByItemId('uuid-1');
 *
 * // Get items that allow options
 * const itemsWithOptions = await MenuService.getItemsWithOptions('mongo-id');
 * ```
 */
export const MenuService: IMenuService = {
  // =========================================================================
  // CRUD Operations
  // =========================================================================
  create: createMenu,
  findById: findMenuById,
  findByMenuId: findMenuByMenuId,
  findAll: findAllMenus,
  findOne: findOneMenu,
  update: updateMenu,
  delete: deleteMenu,
  count: countMenus,

  // =========================================================================
  // Search Operations
  // =========================================================================
  findByName: findMenusByName,
  findByItemId: findMenusByItemId,

  // =========================================================================
  // Item Management
  // =========================================================================
  addItem: addItemToMenu,
  removeItem: removeItemFromMenu,
  updateItem: updateMenuItem,
  bulkAddItems: bulkAddItemsToMenu,
  clearItems: clearMenuItems,
  replaceItems: replaceMenuItems,

  // =========================================================================
  // Item Query Operations
  // =========================================================================
  getItem: getMenuItem,
  hasItem: hasMenuItem,
  getItemCount: getMenuItemCount,
  getItemsWithOptions: getItemsWithOptions,
  getItemsWithoutOptions: getItemsWithoutOptions,
};

export default MenuService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // CRUD
  createMenu,
  findMenuById,
  findMenuByMenuId,
  findAllMenus,
  findOneMenu,
  updateMenu,
  deleteMenu,
  countMenus,

  // Search
  findMenusByName,
  findMenusByItemId,

  // Item Management
  addItemToMenu,
  removeItemFromMenu,
  updateMenuItem,
  bulkAddItemsToMenu,
  clearMenuItems,
  replaceMenuItems,

  // Item Query
  getMenuItem,
  hasMenuItem,
  getMenuItemCount,
  getItemsWithOptions,
  getItemsWithoutOptions,
};

// Re-export types
export type { FindAllMenusOptions } from './findAllMenus.js';
export type {
  IMenuDocument,
  IMenuItem,
  CreateMenuInput,
  UpdateMenuInput,
  AddMenuItemInput,
  BulkAddMenuItemsInput,
  UpdateMenuItemInput,
} from '../interfaces/menu.interface.js';
