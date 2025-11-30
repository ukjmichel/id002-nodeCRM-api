/**
 * Item Option Routes
 * Defines all API endpoints for item option management
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /bulk, /search, /count) MUST come BEFORE dynamic routes (e.g., /:id)
 * - Otherwise Express will match /search as /:id with id="search"
 */

import { Router } from 'express';
import {
  // CRUD Controllers
  createItemOptionController,
  findAllItemOptionsController,
  findItemOptionByIdController,
  updateItemOptionController,
  deleteItemOptionController,
  bulkCreateItemOptionsController,
  countItemOptionsController,
  // Find Controllers
  findItemOptionByOptionIdController,
  findItemOptionsByItemIdController,
  getOptionsByItemsController,
  // Item Management Controllers
  addItemToOptionController,
  addMultipleItemsToOptionController,
  removeItemFromOptionController,
  removeMultipleItemsFromOptionController,
  clearAllItemsController,
  replaceAllItemsController,
  // Query Controllers
  hasItemController,
  getItemCountController,
  getActiveItemsController,
  getItemDetailsController,
  // Update Controllers
  updateOptionDescriptionController,
  updateItemMaxQuantityController,
  setItemActiveStatusController,
  bulkUpdateItemsController,
  activateAllItemsController,
  deactivateAllItemsController,
} from '../controllers/index.js';
import {
  // ID Validators
  optionIdParamValidator,
  itemIdParamValidator,
  mongoIdParamValidator,
  // CRUD Validators
  createItemOptionValidator,
  updateItemOptionValidator,
  bulkCreateItemOptionsValidator,
  // Item Management Validators
  addItemValidator,
  removeItemValidator,
  bulkItemsValidator,
  replaceItemsValidator,
  bulkUpdateItemsValidator,
  // Query Validators
  hasItemValidator,
  getOptionsByItemsValidator,
  updateDescriptionValidator,
  updateMaxQuantityValidator,
  setActiveStatusValidator,
  queryParamsValidator,
} from '../validators/index.js';

const router = Router();

// ============================================================================
// POST ROUTES - Specific routes first
// ============================================================================

/**
 * @route   POST /api/item-options
 * @desc    Create a new item option
 * @access  Private
 */
router.post('/', createItemOptionValidator, createItemOptionController);

/**
 * @route   POST /api/item-options/bulk
 * @desc    Bulk create item options
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/bulk',
  bulkCreateItemOptionsValidator,
  bulkCreateItemOptionsController
);

/**
 * @route   POST /api/item-options/search/by-items
 * @desc    Search options by item IDs
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/search/by-items',
  getOptionsByItemsValidator,
  getOptionsByItemsController
);

// ============================================================================
// GET ROUTES - Specific routes first, then dynamic routes
// ============================================================================

/**
 * @route   GET /api/item-options/count
 * @desc    Count item options with optional filters
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', queryParamsValidator, countItemOptionsController);

/**
 * @route   GET /api/item-options/option/:optionId
 * @desc    Get an option by optionId
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/option/:optionId',
  optionIdParamValidator,
  findItemOptionByOptionIdController
);

/**
 * @route   GET /api/item-options/item/:itemId
 * @desc    Get all options containing a specific item
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/item/:itemId',
  itemIdParamValidator,
  findItemOptionsByItemIdController
);

/**
 * @route   GET /api/item-options
 * @desc    Get all item options with optional filters and pagination
 * @access  Public
 */
router.get('/', queryParamsValidator, findAllItemOptionsController);

/**
 * @route   GET /api/item-options/:id
 * @desc    Get a single item option by MongoDB ID
 * @access  Public
 * @note    Generic /:id route - comes AFTER all specific routes
 */
router.get('/:id', mongoIdParamValidator, findItemOptionByIdController);

// ============================================================================
// OPTION ITEM MANAGEMENT ROUTES
// Routes for managing items within options (using optionId)
// ============================================================================

/**
 * @route   GET /api/item-options/:optionId/items/count
 * @desc    Get the number of items in an option
 * @access  Public
 */
router.get(
  '/:optionId/items/count',
  optionIdParamValidator,
  getItemCountController
);

/**
 * @route   GET /api/item-options/:optionId/items/active
 * @desc    Get all active items in an option
 * @access  Public
 */
router.get(
  '/:optionId/items/active',
  optionIdParamValidator,
  getActiveItemsController
);

/**
 * @route   GET /api/item-options/:optionId/items/:itemId/exists
 * @desc    Check if an option contains a specific item
 * @access  Public
 */
router.get(
  '/:optionId/items/:itemId/exists',
  hasItemValidator,
  hasItemController
);

/**
 * @route   GET /api/item-options/:optionId/items/:itemId
 * @desc    Get details of a specific item in an option
 * @access  Public
 */
router.get(
  '/:optionId/items/:itemId',
  hasItemValidator,
  getItemDetailsController
);

/**
 * @route   POST /api/item-options/:optionId/items
 * @desc    Add a single item to an option
 * @access  Private
 * @body    { itemId: string, maxQuantity?: number, active?: boolean }
 */
router.post('/:optionId/items', addItemValidator, addItemToOptionController);

/**
 * @route   POST /api/item-options/:optionId/items/bulk
 * @desc    Add multiple items to an option
 * @access  Private
 * @body    { itemIds: string[], defaultMaxQuantity?: number, defaultActive?: boolean }
 */
router.post(
  '/:optionId/items/bulk',
  bulkItemsValidator,
  addMultipleItemsToOptionController
);

/**
 * @route   POST /api/item-options/:optionId/items/activate-all
 * @desc    Activate all items in an option
 * @access  Private
 */
router.post(
  '/:optionId/items/activate-all',
  optionIdParamValidator,
  activateAllItemsController
);

/**
 * @route   POST /api/item-options/:optionId/items/deactivate-all
 * @desc    Deactivate all items in an option
 * @access  Private
 */
router.post(
  '/:optionId/items/deactivate-all',
  optionIdParamValidator,
  deactivateAllItemsController
);

/**
 * @route   PUT /api/item-options/:optionId/items
 * @desc    Replace all items in an option
 * @access  Private
 * @body    { itemIds: string[], defaultMaxQuantity?: number, defaultActive?: boolean }
 */
router.put(
  '/:optionId/items',
  replaceItemsValidator,
  replaceAllItemsController
);

/**
 * @route   DELETE /api/item-options/:optionId/items
 * @desc    Clear all items from an option
 * @access  Private
 */
router.delete(
  '/:optionId/items',
  optionIdParamValidator,
  clearAllItemsController
);

/**
 * @route   DELETE /api/item-options/:optionId/items/bulk
 * @desc    Remove multiple items from an option
 * @access  Private
 * @body    { itemIds: string[] }
 */
router.delete(
  '/:optionId/items/bulk',
  bulkItemsValidator,
  removeMultipleItemsFromOptionController
);

/**
 * @route   DELETE /api/item-options/:optionId/items/:itemId
 * @desc    Remove a single item from an option
 * @access  Private
 */
router.delete(
  '/:optionId/items/:itemId',
  removeItemValidator,
  removeItemFromOptionController
);

// ============================================================================
// PATCH ROUTES - Option and item updates
// ============================================================================

/**
 * @route   PATCH /api/item-options/:optionId/description
 * @desc    Update the description of an option
 * @access  Private
 * @body    { description: string }
 */
router.patch(
  '/:optionId/description',
  updateDescriptionValidator,
  updateOptionDescriptionController
);

/**
 * @route   PATCH /api/item-options/:optionId/items/bulk
 * @desc    Bulk update items in an option (maxQuantity and/or active status)
 * @access  Private
 * @body    { updates: [{ itemId: string, maxQuantity?: number, active?: boolean }] }
 */
router.patch(
  '/:optionId/items/bulk',
  bulkUpdateItemsValidator,
  bulkUpdateItemsController
);

/**
 * @route   PATCH /api/item-options/:optionId/items/:itemId/max-quantity
 * @desc    Update the max quantity of an item in an option
 * @access  Private
 * @body    { maxQuantity: number }
 */
router.patch(
  '/:optionId/items/:itemId/max-quantity',
  updateMaxQuantityValidator,
  updateItemMaxQuantityController
);

/**
 * @route   PATCH /api/item-options/:optionId/items/:itemId/active
 * @desc    Set the active status of an item in an option
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
 * @route   PUT /api/item-options/:id
 * @desc    Update an item option by MongoDB ID (full update)
 * @access  Private
 */
router.put('/:id', updateItemOptionValidator, updateItemOptionController);

// ============================================================================
// DELETE ROUTES - By MongoDB ID
// ============================================================================

/**
 * @route   DELETE /api/item-options/:id
 * @desc    Delete an item option by MongoDB ID
 * @access  Private
 */
router.delete('/:id', mongoIdParamValidator, deleteItemOptionController);

export default router;
