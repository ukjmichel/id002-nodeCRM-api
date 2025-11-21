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
  BusinessItemAttributes,
  BusinessItemSearchCriteria,
} from '../interfaces/business-item.interface.js';
import { BusinessItemModel, ItemType, ItemCategory } from '../models/business-item.model.js';

// Import all service methods
import { createBusinessItem } from './createBusinessItem.js';
import { updateBusinessItem } from './updateBusinessItem.js';
import { deleteBusinessItem } from './deleteBusinessItem.js';
import { findAllBusinessItems } from './findAllBusinessItems.js';
import { findBusinessItemById } from './findBusinessItemById.js';
import { findOneBusinessItem } from './findOneBusinessItem.js';
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
import { countBusinessItems } from './countBusinessItems.js';
import { bulkCreateBusinessItems } from './bulkCreateBusinessItems.js';
import { searchBusinessItems } from './searchBusinessItems.js';
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
export interface IBusinessItemService extends ICrudService<BusinessItemModel> {
  // Find by identifiers
  findBySku(sku: string, options?: FindOneOptions): Promise<ApiResponse<BusinessItemModel>>;
  findByBarcode(barcode: string, options?: FindOneOptions): Promise<ApiResponse<BusinessItemModel>>;
  
  // Find by business
  findByBusinessId(businessId: string): Promise<ApiResponse<BusinessItemModel[]>>;
  
  // Find by type/category
  findByType(type: ItemType, businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  findByCategory(category: ItemCategory, businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  
  // Find by availability
  findAvailableItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  findFeaturedItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  
  // Find by dietary restrictions
  findVeganItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  findVegetarianItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  findHalalItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  findGlutenFreeItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
  
  // Search
  searchItems(criteria: BusinessItemSearchCriteria): Promise<ApiResponse<BusinessItemModel[]>>;
  
  // Availability management
  setAvailability(itemId: string, available: boolean): Promise<ApiResponse<BusinessItemModel>>;
  makeAvailable(itemId: string): Promise<ApiResponse<BusinessItemModel>>;
  makeUnavailable(itemId: string): Promise<ApiResponse<BusinessItemModel>>;
  
  // Featured management
  setFeatured(itemId: string, featured: boolean): Promise<ApiResponse<BusinessItemModel>>;
  feature(itemId: string): Promise<ApiResponse<BusinessItemModel>>;
  unfeature(itemId: string): Promise<ApiResponse<BusinessItemModel>>;
  
  // Stock management
  updateStock(itemId: string, quantity: number): Promise<ApiResponse<BusinessItemModel>>;
  incrementStock(itemId: string, increment: number): Promise<ApiResponse<BusinessItemModel>>;
  decrementStock(itemId: string, decrement: number): Promise<ApiResponse<BusinessItemModel>>;
  findLowStockItems(businessId?: string): Promise<ApiResponse<BusinessItemModel[]>>;
}

/**
 * Business Item Service
 * Provides all CRUD operations and item-specific business logic
 *
 * @example
 * ```typescript
 * import { businessItemService } from './services/business-item';
 *
 * // Create a new item
 * const newItem = await businessItemService.create({
 *   businessId: 'business-uuid',
 *   name: 'Margherita Pizza',
 *   type: 'food',
 *   price: 12.99,
 *   isVegetarian: true
 * });
 *
 * // Find vegan items
 * const veganItems = await businessItemService.findVeganItems('business-uuid');
 *
 * // Search items with dietary filters
 * const results = await businessItemService.searchItems({
 *   query: 'pizza',
 *   isVegetarian: true,
 *   excludeNuts: true,
 *   maxPrice: 15
 * });
 *
 * // Update stock
 * await businessItemService.decrementStock('item-uuid', 5);
 *
 * // Feature an item
 * await businessItemService.feature('item-uuid');
 * ```
 */
export const businessItemService: IBusinessItemService = {
  // =========================================================================
  // CRUD Operations
  // =========================================================================
  create: createBusinessItem,
  findAll: findAllBusinessItems,
  findById: findBusinessItemById,
  findOne: findOneBusinessItem,
  update: updateBusinessItem,
  delete: deleteBusinessItem,
  bulkCreate: bulkCreateBusinessItems,
  count: countBusinessItems,

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
  searchItems: searchBusinessItems,

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

export default businessItemService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // CRUD
  createBusinessItem,
  updateBusinessItem,
  deleteBusinessItem,
  findAllBusinessItems,
  findBusinessItemById,
  findOneBusinessItem,
  bulkCreateBusinessItems,
  countBusinessItems,

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
  searchBusinessItems,

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
export { ItemType, ItemCategory } from '../models/business-item.model.js';
export type { BusinessItemAttributes, BusinessItemSearchCriteria } from '../interfaces/business-item.interface.js';
