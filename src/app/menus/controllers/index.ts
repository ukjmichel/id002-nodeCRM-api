/**
 * Menu Controllers Index
 * Central export point for all menu controllers
 */

// =============================================================================
// CRUD Operations
// =============================================================================
export { createMenuController } from './createMenu.controller.js';
export { findAllMenusController } from './findAllMenus.controller.js';
export { findMenuByIdController } from './findMenuById.controller.js';
export { updateMenuController } from './updateMenu.controller.js';
export { deleteMenuController } from './deleteMenu.controller.js';
export { bulkCreateMenusController } from './bulkCreateMenus.controller.js';
export { countMenusController } from './countMenus.controller.js';

// =============================================================================
// Find Methods
// =============================================================================
export { findMenuByMenuIdController } from './findMenuByMenuId.controller.js';
export { findMenusByItemIdController } from './findMenusByItemId.controller.js';
export { findMenusByNameController } from './findMenusByName.controller.js';
export { getMenusByItemsController } from './getMenusByItems.controller.js';

// =============================================================================
// Item Management
// =============================================================================
export { addItemToMenuController } from './addItemToMenu.controller.js';
export { addMultipleItemsToMenuController } from './addMultipleItemsToMenu.controller.js';
export { removeItemFromMenuController } from './removeItemFromMenu.controller.js';
export { removeMultipleItemsFromMenuController } from './removeMultipleItemsFromMenu.controller.js';
export { clearAllItemsController } from './clearAllItems.controller.js';
export { replaceAllItemsController } from './replaceAllItems.controller.js';

// =============================================================================
// Query Methods
// =============================================================================
export { hasItemController } from './hasItem.controller.js';
export { getItemCountController } from './getItemCount.controller.js';
export { getItemDetailsController } from './getItemDetails.controller.js';

// =============================================================================
// Update Methods
// =============================================================================
export { updateMenuNameController } from './updateMenuName.controller.js';
export { updateMenuDescriptionController } from './updateMenuDescription.controller.js';
export { updateItemQuantityController } from './updateItemQuantity.controller.js';
export { bulkUpdateItemsController } from './bulkUpdateItems.controller.js';

// =============================================================================
// Active Options Management
// =============================================================================
export { addActiveOptionController } from './addActiveOption.controller.js';
export { removeActiveOptionController } from './removeActiveOption.controller.js';
export { getActiveOptionsController } from './getActiveOptions.controller.js';
export { setActiveOptionsController } from './setActiveOptions.controller.js';

// =============================================================================
// Default Items Management
// =============================================================================
export { addDefaultItemController } from './addDefaultItem.controller.js';
export { removeDefaultItemController } from './removeDefaultItem.controller.js';
export { getDefaultItemsController } from './getDefaultItems.controller.js';
export { setDefaultItemsController } from './setDefaultItems.controller.js';
