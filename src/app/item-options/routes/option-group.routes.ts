/**
 * Option Group Routes
 * Defines all API endpoints for option group management
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /bulk, /search, /count) MUST come BEFORE dynamic routes (e.g., /:id)
 * - Otherwise Express will match /search as /:id with id="search"
 */

import { Router } from 'express';
import {
  // CRUD Controllers
  createOptionGroupController,
  findAllOptionGroupsController,
  findOptionGroupByIdController,
  updateOptionGroupController,
  deleteOptionGroupController,
  bulkCreateOptionGroupsController,
  countOptionGroupsController,
  // Find Controllers
  findOptionGroupByOptionIdController,
  findOptionGroupsByItemIdController,
  getOptionGroupsByItemsController,
  // Item Management Controllers
  addItemToOptionGroupController,
  addMultipleItemsToOptionGroupController,
  removeItemFromOptionGroupController,
  removeMultipleItemsFromOptionGroupController,
  clearAllItemsController,
  replaceAllItemsController,
  // Query Controllers
  hasItemController,
  getItemCountController,
  getActiveItemsController,
  getItemDetailsController,
  // Update Controllers
  updateOptionGroupDescriptionController,
  updateItemMaxQuantityController,
  setItemActiveStatusController,
  bulkUpdateItemsController,
  activateAllItemsController,
  deactivateAllItemsController,
} from '../controllers/option-groups//index.js';
import {
  // ID Validators
  optionIdParamValidator,
  itemIdParamValidator,
  mongoIdParamValidator,
  // CRUD Validators
  createOptionGroupValidator,
  updateOptionGroupValidator,
  bulkCreateOptionGroupsValidator,
  // Item Management Validators
  addItemValidator,
  removeItemValidator,
  bulkItemsValidator,
  replaceItemsValidator,
  bulkUpdateItemsValidator,
  // Query Validators
  hasItemValidator,
  getOptionGroupsByItemsValidator,
  updateDescriptionValidator,
  updateMaxQuantityValidator,
  setActiveStatusValidator,
  queryParamsValidator,
} from '../validators/option-groups/index.js';

const router = Router();

// ============================================================================
// POST ROUTES - Specific routes first
// ============================================================================

/**
 * @route   POST /api/option-groups
 * @desc    Create a new option group
 * @access  Private
 */
router.post('/', createOptionGroupValidator, createOptionGroupController);

/**
 * @route   POST /api/option-groups/bulk
 * @desc    Bulk create option groups
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/bulk',
  bulkCreateOptionGroupsValidator,
  bulkCreateOptionGroupsController
);

/**
 * @route   POST /api/option-groups/search/by-items
 * @desc    Search option groups by item IDs
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/search/by-items',
  getOptionGroupsByItemsValidator,
  getOptionGroupsByItemsController
);

// ============================================================================
// GET ROUTES - Specific routes first, then dynamic routes
// ============================================================================

/**
 * @route   GET /api/option-groups/count
 * @desc    Count option groups with optional filters
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', queryParamsValidator, countOptionGroupsController);

/**
 * @route   GET /api/option-groups/option/:optionId
 * @desc    Get an option group by optionId
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/option/:optionId',
  optionIdParamValidator,
  findOptionGroupByOptionIdController
);

/**
 * @route   GET /api/option-groups/item/:itemId
 * @desc    Get all option groups containing a specific item
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/item/:itemId',
  itemIdParamValidator,
  findOptionGroupsByItemIdController
);

/**
 * @route   GET /api/option-groups
 * @desc    Get all option groups with optional filters and pagination
 * @access  Public
 */
router.get('/', queryParamsValidator, findAllOptionGroupsController);

/**
 * @route   GET /api/option-groups/:id
 * @desc    Get a single option group by MongoDB ID
 * @access  Public
 * @note    Generic /:id route - comes AFTER all specific routes
 */
router.get('/:id', mongoIdParamValidator, findOptionGroupByIdController);

// ============================================================================
// OPTION GROUP ITEM MANAGEMENT ROUTES
// Routes for managing items within option groups (using optionId)
// ============================================================================

/**
 * @route   GET /api/option-groups/:optionId/items/count
 * @desc    Get the number of items in an option group
 * @access  Public
 */
router.get(
  '/:optionId/items/count',
  optionIdParamValidator,
  getItemCountController
);

/**
 * @route   GET /api/option-groups/:optionId/items/active
 * @desc    Get all active items in an option group
 * @access  Public
 */
router.get(
  '/:optionId/items/active',
  optionIdParamValidator,
  getActiveItemsController
);

/**
 * @route   GET /api/option-groups/:optionId/items/:itemId/exists
 * @desc    Check if an option group contains a specific item
 * @access  Public
 */
router.get(
  '/:optionId/items/:itemId/exists',
  hasItemValidator,
  hasItemController
);

/**
 * @route   GET /api/option-groups/:optionId/items/:itemId
 * @desc    Get details of a specific item in an option group
 * @access  Public
 */
router.get(
  '/:optionId/items/:itemId',
  hasItemValidator,
  getItemDetailsController
);

/**
 * @route   POST /api/option-groups/:optionId/items
 * @desc    Add a single item to an option group
 * @access  Private
 * @body    { itemId: string, maxQuantity?: number, active?: boolean }
 */
router.post(
  '/:optionId/items',
  addItemValidator,
  addItemToOptionGroupController
);

/**
 * @route   POST /api/option-groups/:optionId/items/bulk
 * @desc    Add multiple items to an option group
 * @access  Private
 * @body    { itemIds: string[], defaultMaxQuantity?: number, defaultActive?: boolean }
 */
router.post(
  '/:optionId/items/bulk',
  bulkItemsValidator,
  addMultipleItemsToOptionGroupController
);

/**
 * @route   POST /api/option-groups/:optionId/items/activate-all
 * @desc    Activate all items in an option group
 * @access  Private
 */
router.post(
  '/:optionId/items/activate-all',
  optionIdParamValidator,
  activateAllItemsController
);

/**
 * @route   POST /api/option-groups/:optionId/items/deactivate-all
 * @desc    Deactivate all items in an option group
 * @access  Private
 */
router.post(
  '/:optionId/items/deactivate-all',
  optionIdParamValidator,
  deactivateAllItemsController
);

/**
 * @route   PUT /api/option-groups/:optionId/items
 * @desc    Replace all items in an option group
 * @access  Private
 * @body    { itemIds: string[], defaultMaxQuantity?: number, defaultActive?: boolean }
 */
router.put(
  '/:optionId/items',
  replaceItemsValidator,
  replaceAllItemsController
);

/**
 * @route   DELETE /api/option-groups/:optionId/items
 * @desc    Clear all items from an option group
 * @access  Private
 */
router.delete(
  '/:optionId/items',
  optionIdParamValidator,
  clearAllItemsController
);

/**
 * @route   DELETE /api/option-groups/:optionId/items/bulk
 * @desc    Remove multiple items from an option group
 * @access  Private
 * @body    { itemIds: string[] }
 */
router.delete(
  '/:optionId/items/bulk',
  bulkItemsValidator,
  removeMultipleItemsFromOptionGroupController
);

/**
 * @route   DELETE /api/option-groups/:optionId/items/:itemId
 * @desc    Remove a single item from an option group
 * @access  Private
 */
router.delete(
  '/:optionId/items/:itemId',
  removeItemValidator,
  removeItemFromOptionGroupController
);

// ============================================================================
// PATCH ROUTES - Option group and item updates
// ============================================================================

/**
 * @route   PATCH /api/option-groups/:optionId/description
 * @desc    Update the description of an option group
 * @access  Private
 * @body    { description: string }
 */
router.patch(
  '/:optionId/description',
  updateDescriptionValidator,
  updateOptionGroupDescriptionController
);

/**
 * @route   PATCH /api/option-groups/:optionId/items/bulk
 * @desc    Bulk update items in an option group (maxQuantity and/or active status)
 * @access  Private
 * @body    { updates: [{ itemId: string, maxQuantity?: number, active?: boolean }] }
 */
router.patch(
  '/:optionId/items/bulk',
  bulkUpdateItemsValidator,
  bulkUpdateItemsController
);

/**
 * @route   PATCH /api/option-groups/:optionId/items/:itemId/max-quantity
 * @desc    Update the max quantity of an item in an option group
 * @access  Private
 * @body    { maxQuantity: number }
 */
router.patch(
  '/:optionId/items/:itemId/max-quantity',
  updateMaxQuantityValidator,
  updateItemMaxQuantityController
);

/**
 * @route   PATCH /api/option-groups/:optionId/items/:itemId/active
 * @desc    Set the active status of an item in an option group
 * @access  Private
 * @body    { active: boolean }
 */
router.patch(
  '/:optionId/items/:itemId/active',
  setActiveStatusValidator,
  setItemActiveStatusController
);

// ============================================================================
// PUT ROUTES - Full updates by MongoDB ID
// ============================================================================

/**
 * @route   PUT /api/option-groups/:id
 * @desc    Update an option group by MongoDB ID (full update)
 * @access  Private
 */
router.put('/:id', updateOptionGroupValidator, updateOptionGroupController);

// ============================================================================
// DELETE ROUTES - By MongoDB ID
// ============================================================================

/**
 * @route   DELETE /api/option-groups/:id
 * @desc    Delete an option group by MongoDB ID
 * @access  Private
 */
router.delete('/:id', mongoIdParamValidator, deleteOptionGroupController);

export default router;
