/**
 * Option Group Controllers Index
 * Central export point for all option group controllers
 */

// =============================================================================
// CRUD Operations
// =============================================================================
export { createOptionGroupController } from './createOptionGroup.controller.js';
export { findAllOptionGroupsController } from './findAllOptionGroups.controller.js';
export { findOptionGroupByIdController } from './findOptionGroupById.controller.js';
export { updateOptionGroupController } from './updateOptionGroup.controller.js';
export { deleteOptionGroupController } from './deleteOptionGroup.controller.js';
export { bulkCreateOptionGroupsController } from './bulkCreateOptionGroups.controller.js';
export { countOptionGroupsController } from './countOptionGroups.controller.js';

// =============================================================================
// Find Methods
// =============================================================================
export { findOptionGroupByOptionIdController } from './findOptionGroupByOptionId.controller.js';
export { findOptionGroupsByItemIdController } from './findOptionGroupsByItemId.controller.js';
export { getOptionGroupsByItemsController } from './getOptionGroupsByItems.controller.js';

// =============================================================================
// Item Management
// =============================================================================
export { addItemToOptionGroupController } from './addItemToOptionGroup.controller.js';
export { addMultipleItemsToOptionGroupController } from './addMultipleItemsToOptionGroup.controller.js';
export { removeItemFromOptionGroupController } from './removeItemFromOptionGroup.controller.js';
export { removeMultipleItemsFromOptionGroupController } from './removeMultipleItemsFromOptionGroup.controller.js';
export { clearAllItemsController } from './clearAllItems.controller.js';
export { replaceAllItemsController } from './replaceAllItems.controller.js';

// =============================================================================
// Query Methods
// =============================================================================
export { hasItemController } from './hasItem.controller.js';
export { getItemCountController } from './getItemCount.controller.js';
export { getActiveItemsController } from './getActiveItems.controller.js';
export { getItemDetailsController } from './getItemDetails.controller.js';

// =============================================================================
// Update Methods
// =============================================================================
export { updateOptionGroupDescriptionController } from './updateOptionGroupDescription.controller.js';
export { updateItemMaxQuantityController } from './updateItemMaxQuantity.controller.js';
export { setItemActiveStatusController } from './setItemActiveStatus.controller.js';
export { bulkUpdateItemsController } from './bulkUpdateItems.controller.js';
export { activateAllItemsController } from './activateAllItems.controller.js';
export { deactivateAllItemsController } from './deactivateAllItems.controller.js';
