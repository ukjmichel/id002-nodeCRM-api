/**
 * Business Item Controllers Index
 * Central export point for all business item controllers
 */

// CRUD Operations
export { createItemController } from './createItem.controller.js';
export { updateItemController } from './updateItem.controller.js';
export { deleteItemController } from './deleteItem.controller.js';
export { findAllItemsController } from './findAllItems.controller.js';
export { findItemByIdController } from './findItemById.controller.js';
export { bulkCreateItemsController } from './bulkCreateItems.controller.js';
export { countItemsController } from './countItems.controller.js';

// Find by Identifiers
export { findItemBySkuController } from './findItemBySku.controller.js';
export { findItemByBarcodeController } from './findItemByBarcode.controller.js';

// Find by Business
export { findItemsByBusinessIdController } from './findItemsByBusinessId.controller.js';

// Find by Type/Category
export { findItemsByTypeController } from './findItemsByType.controller.js';
export { findItemsByCategoryController } from './findItemsByCategory.controller.js';

// Find by Availability
export { findAvailableItemsController } from './findAvailableItems.controller.js';
export { findFeaturedItemsController } from './findFeaturedItems.controller.js';

// Find by Dietary Restrictions
export { findVeganItemsController } from './findVeganItems.controller.js';
export { findVegetarianItemsController } from './findVegetarianItems.controller.js';
export { findHalalItemsController } from './findHalalItems.controller.js';
export { findGlutenFreeItemsController } from './findGlutenFreeItems.controller.js';

// Search
export { searchItemsController } from './searchItems.controller.js';

// Availability Management
export {
  setItemAvailabilityController,
  makeItemAvailableController,
  makeItemUnavailableController,
} from './setItemAvailability.controller.js';

// Featured Management
export {
  setItemFeaturedController,
  featureItemController,
  unfeatureItemController,
} from './setItemFeatured.controller.js';

// Stock Management
export {
  updateStockController,
  incrementStockController,
  decrementStockController,
  findLowStockItemsController,
} from './updateStock.controller.js';
