/**
 * Item Option Validators Index
 * Central export point for all item option validators
 */

// =============================================================================
// ID Validators
// =============================================================================
export { optionIdParamValidator } from './optionId.validator.js';
export { itemIdParamValidator } from './itemId.validator.js';
export { mongoIdParamValidator } from './mongoId.validator.js';

// =============================================================================
// CRUD Validators
// =============================================================================
export { createItemOptionValidator } from './createItemOption.validator.js';
export { updateItemOptionValidator } from './updateItemOption.validator.js';
export { bulkCreateItemOptionsValidator } from './bulkCreateItemOptions.validator.js';

// =============================================================================
// Item Management Validators
// =============================================================================
export { addItemValidator } from './addItem.validator.js';
export { removeItemValidator } from './removeItem.validator.js';
export { bulkItemsValidator } from './bulkItems.validator.js';
export { replaceItemsValidator } from './replaceItems.validator.js';
export { bulkUpdateItemsValidator } from './bulkUpdateItems.validator.js';

// =============================================================================
// Query Validators
// =============================================================================
export { hasItemValidator } from './hasItem.validator.js';
export { getOptionsByItemsValidator } from './getOptionsByItems.validator.js';
export { queryParamsValidator } from './queryParams.validator.js';

// =============================================================================
// Update Validators
// =============================================================================
export { updateDescriptionValidator } from './updateDescription.validator.js';
export { updateMaxQuantityValidator } from './updateMaxQuantity.validator.js';
export { setActiveStatusValidator } from './setActiveStatus.validator.js';
