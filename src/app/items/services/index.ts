/**
 * =============================================================================
 * Business Item Service - Main Export
 * =============================================================================
 * Combines all business item service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import {
  ApiResponse,
  FindOneOptions,
  ICrudService,
} from '../../../core/utils/crudServiceGenerator.js';
import {
  ItemAttributes,
  ItemSearchCriteria,
} from '../interfaces/item.interface.js';
import {
  ItemModel,
  ItemType,
  ItemCategory,
} from '../models/item.model.js';

// Import all service methods
import { createItem } from './createItem.js';
import { updateItem } from './updateItem.js';
import { deleteItem } from './deleteItem.js';
import { findAllItems } from './findAllItems.js';
import { findItemById } from './findItemById.js';
import { findOneItem } from './findOneItem.js';
import { findItemsByBusinessId } from './findItemsByBusinessId.js';
import { findAvailableItems } from './findAvailableItems.js';
import { findFeaturedItems } from './findFeaturedItems.js';
import { findItemsByType } from './findItemsByType.js';
import { findItemsByCategory } from './findItemsByCategory.js';
import { findItemBySku } from './findItemBySku.js';
import { findItemByBarcode } from './findItemByBarcode.js';
import { findVeganItems } from './findVeganItems.js';

import { findHalalItems } from './findHalalItems.js';
import { findGlutenFreeItems } from './findGlutenFreeItems.js';
import { countItems } from './countItems.js';
import { bulkCreateItems } from './bulkCreateItems.js';
import { searchItems } from './searchItems.js';
import {
  setItemAvailability,
  makeItemAvailable,
  makeItemUnavailable,
} from './setItemAvailability.js';
import {
  setItemFeatured,
  featureItem,
  unfeatureItem,
} from './setItemFeatured.js';
import {
  updateStock,
  incrementStock,
  decrementStock,
  findLowStockItems,
} from './updateStock.js';
import { findVegetarianItems } from './findVegetarianItems.js';

/**
 * Extended Business Item Service Interface
 * Includes standard CRUD operations plus item-specific methods
 */
export interface IItemService extends ICrudService<ItemModel> {
  // Find by identifiers
  findBySku(
    sku: string,
    options?: FindOneOptions
  ): Promise<ApiResponse<ItemModel>>;
  findByBarcode(
    barcode: string,
    options?: FindOneOptions
  ): Promise<ApiResponse<ItemModel>>;

  // Find by business
  findByBusinessId(
    businessId: string
  ): Promise<ApiResponse<ItemModel[]>>;

  // Find by type/category
  findByType(
    type: ItemType,
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;
  findByCategory(
    category: ItemCategory,
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;

  // Find by availability
  findAvailableItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;
  findFeaturedItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;

  // Find by dietary restrictions
  findVeganItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;
  findVegetarianItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;
  findHalalItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;
  findGlutenFreeItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;

  // Search
  searchItems(
    criteria: ItemSearchCriteria
  ): Promise<ApiResponse<ItemModel[]>>;

  // Availability management
  setAvailability(
    itemId: string,
    available: boolean
  ): Promise<ApiResponse<ItemModel>>;
  makeAvailable(itemId: string): Promise<ApiResponse<ItemModel>>;
  makeUnavailable(itemId: string): Promise<ApiResponse<ItemModel>>;

  // Featured management
  setFeatured(
    itemId: string,
    featured: boolean
  ): Promise<ApiResponse<ItemModel>>;
  feature(itemId: string): Promise<ApiResponse<ItemModel>>;
  unfeature(itemId: string): Promise<ApiResponse<ItemModel>>;

  // Stock management
  updateStock(
    itemId: string,
    quantity: number
  ): Promise<ApiResponse<ItemModel>>;
  incrementStock(
    itemId: string,
    increment: number
  ): Promise<ApiResponse<ItemModel>>;
  decrementStock(
    itemId: string,
    decrement: number
  ): Promise<ApiResponse<ItemModel>>;
  findLowStockItems(
    businessId?: string
  ): Promise<ApiResponse<ItemModel[]>>;
}

/**
 * Business Item Service
 * Provides all CRUD operations and item-specific business logic
 *
 * @example
 * ```typescript
 * import { ItemService } from './services/business-item';
 *
 * // Create a new item
 * const newItem = await ItemService.create({
 *   businessId: 'business-uuid',
 *   name: 'Margherita Pizza',
 *   type: 'food',
 *   price: 12.99,
 *   isVegetarian: true
 * });
 *
 * // Find vegan items
 * const veganItems = await ItemService.findVeganItems('business-uuid');
 *
 * // Search items with dietary filters
 * const results = await ItemService.searchItems({
 *   query: 'pizza',
 *   isVegetarian: true,
 *   excludeNuts: true,
 *   maxPrice: 15
 * });
 *
 * // Update stock
 * await ItemService.decrementStock('item-uuid', 5);
 *
 * // Feature an item
 * await ItemService.feature('item-uuid');
 * ```
 */
export const ItemService: IItemService = {
  // =========================================================================
  // CRUD Operations
  // =========================================================================
  create: createItem,
  findAll: findAllItems,
  findById: findItemById,
  findOne: findOneItem,
  update: updateItem,
  delete: deleteItem,
  bulkCreate: bulkCreateItems,
  count: countItems,

  // =========================================================================
  // Find by Identifiers
  // =========================================================================
  findBySku: findItemBySku,
  findByBarcode: findItemByBarcode,

  // =========================================================================
  // Find by Business
  // =========================================================================
  findByBusinessId: findItemsByBusinessId,

  // =========================================================================
  // Find by Type/Category
  // =========================================================================
  findByType: findItemsByType,
  findByCategory: findItemsByCategory,

  // =========================================================================
  // Find by Availability
  // =========================================================================
  findAvailableItems: findAvailableItems,
  findFeaturedItems: findFeaturedItems,

  // =========================================================================
  // Find by Dietary Restrictions
  // =========================================================================
  findVeganItems: findVeganItems,
  findVegetarianItems: findVegetarianItems,
  findHalalItems: findHalalItems,
  findGlutenFreeItems: findGlutenFreeItems,

  // =========================================================================
  // Search
  // =========================================================================
  searchItems: searchItems,

  // =========================================================================
  // Availability Management
  // =========================================================================
  setAvailability: setItemAvailability,
  makeAvailable: makeItemAvailable,
  makeUnavailable: makeItemUnavailable,

  // =========================================================================
  // Featured Management
  // =========================================================================
  setFeatured: setItemFeatured,
  feature: featureItem,
  unfeature: unfeatureItem,

  // =========================================================================
  // Stock Management
  // =========================================================================
  updateStock: updateStock,
  incrementStock: incrementStock,
  decrementStock: decrementStock,
  findLowStockItems: findLowStockItems,
};

export default ItemService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // CRUD
  createItem,
  updateItem,
  deleteItem,
  findAllItems,
  findItemById,
  findOneItem,
  bulkCreateItems,
  countItems,

  // Find by identifiers
  findItemBySku,
  findItemByBarcode,

  // Find by business
  findItemsByBusinessId,

  // Find by type/category
  findItemsByType,
  findItemsByCategory,

  // Find by availability
  findAvailableItems,
  findFeaturedItems,

  // Find by dietary restrictions
  findVeganItems,
  findVegetarianItems,
  findHalalItems,
  findGlutenFreeItems,

  // Search
  searchItems,

  // Availability management
  setItemAvailability,
  makeItemAvailable,
  makeItemUnavailable,

  // Featured management
  setItemFeatured,
  featureItem,
  unfeatureItem,

  // Stock management
  updateStock,
  incrementStock,
  decrementStock,
  findLowStockItems,
};

// Re-export types and enums
export { ItemType, ItemCategory } from '../models/item.model.js';
export type {
  ItemAttributes,
  ItemSearchCriteria,
} from '../interfaces/item.interface.js';
