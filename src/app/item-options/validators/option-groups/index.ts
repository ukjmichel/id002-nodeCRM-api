/**
 * Option Group Validators Index
 * Central export point for all option group validators
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
export { createOptionGroupValidator } from './createOptionGroup.validator.js';
export { updateOptionGroupValidator } from './updateOptionGroup.validator.js';
export { bulkCreateOptionGroupsValidator } from './bulkCreateOptionGroups.validator.js';

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
export { getOptionGroupsByItemsValidator } from './getOptionGroupsByItems.validator.js';
export { queryParamsValidator } from './queryParams.validator.js';

// =============================================================================
// Update Validators
// =============================================================================
export { updateDescriptionValidator } from './updateDescription.validator.js';
export { updateMaxQuantityValidator } from './updateMaxQuantity.validator.js';
export { setActiveStatusValidator } from './setActiveStatus.validator.js';
