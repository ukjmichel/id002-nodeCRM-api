/**
 * Menu Validators Index
 * Central export point for all menu validators
 */

// =============================================================================
// ID Validators
// =============================================================================
export { menuIdParamValidator } from './menuId.validator.js';
export { itemIdParamValidator } from './itemId.validator.js';
export { mongoIdParamValidator } from './mongoId.validator.js';
export { optionIdParamValidator } from './optionId.validator.js';
export { defaultItemIdParamValidator } from './defaultItemId.validator.js';

// =============================================================================
// CRUD Validators
// =============================================================================
export { createMenuValidator } from './createMenu.validator.js';
export { updateMenuValidator } from './updateMenu.validator.js';
export { bulkCreateMenusValidator } from './bulkCreateMenus.validator.js';

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
export { getMenusByItemsValidator } from './getMenusByItems.validator.js';
export { queryParamsValidator } from './queryParams.validator.js';

// =============================================================================
// Update Validators
// =============================================================================
export { updateNameValidator } from './updateName.validator.js';
export { updateQuantityValidator } from './updateQuantity.validator.js';
export { updateBusinessValidator } from '../../businesses/validators/updateBusiness.validator.js';
// =============================================================================
// Active Options Validators
// =============================================================================
export {
  addActiveOptionValidator,
  removeActiveOptionValidator,
  getActiveOptionsValidator,
  setActiveOptionsValidator,
} from './activeOption.validator.js';

// =============================================================================
// Default Items Validators
// =============================================================================
export {
  addDefaultItemValidator,
  removeDefaultItemValidator,
  getDefaultItemsValidator,
  setDefaultItemsValidator,
} from './defaultItem.validator.js';
