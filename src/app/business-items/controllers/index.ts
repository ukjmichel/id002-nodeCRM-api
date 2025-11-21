/**
 * Business Item Controllers Index
 * Central export point for all business item controllers
 */

// CRUD Operations
export { createBusinessItemController } from './createBusinessItem.controller.js';
export { updateBusinessItemController } from './updateBusinessItem.controller.js';
export { deleteBusinessItemController } from './deleteBusinessItem.controller.js';
export { findAllBusinessItemsController } from './findAllBusinessItems.controller.js';
export { findBusinessItemByIdController } from './findBusinessItemById.controller.js';
export { bulkCreateBusinessItemsController } from './bulkCreateBusinessItems.controller.js';
export { countBusinessItemsController } from './countBusinessItems.controller.js';

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
export { searchBusinessItemsController } from './searchBusinessItems.controller.js';

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
