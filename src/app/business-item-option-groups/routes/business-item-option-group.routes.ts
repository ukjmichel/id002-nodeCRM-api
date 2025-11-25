/**
 * Business Item Option Group Routes
 * Defines all API endpoints for business item option group management
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /bulk, /search, /count) MUST come BEFORE dynamic routes (e.g., /:id)
 * - Otherwise Express will match /search as /:id with id="search"
 */

import { Router } from 'express';
import {
  // CRUD Controllers
  createBusinessItemOptionGroupController,
  findAllBusinessItemOptionGroupsController,
  findBusinessItemOptionGroupByIdController,
  updateBusinessItemOptionGroupController,
  deleteBusinessItemOptionGroupController,
  bulkCreateBusinessItemOptionGroupsController,
  countBusinessItemOptionGroupsController,
  // Find Controllers
  findBusinessItemOptionGroupByOptionIdController,
  findBusinessItemOptionGroupsByItemIdController,
  getGroupsByItemsController,
  // Item Management Controllers
  addItemToGroupController,
  removeItemFromGroupController,
  addMultipleItemsToGroupController,
  removeMultipleItemsFromGroupController,
  clearAllItemsController,
  replaceAllItemsController,
  // Query Controllers
  hasItemController,
  getItemCountController,
  // Update Controllers
  updateGroupDescriptionController,
} from '../controllers/index.js';
import {
  // ID Validators
  optionIdParamValidator,
  itemIdParamValidator,
  mongoIdParamValidator,
  // CRUD Validators
  createBusinessItemOptionGroupValidator,
  updateBusinessItemOptionGroupValidator,
  bulkCreateBusinessItemOptionGroupsValidator,
  // Item Management Validators
  addItemValidator,
  removeItemValidator,
  bulkItemsValidator,
  replaceItemsValidator,
  // Query Validators
  hasItemValidator,
  getGroupsByItemsValidator,
  updateDescriptionValidator,
  queryParamsValidator,
} from '../validators/index.js';

const router = Router();

// ============================================================================
// POST ROUTES - Specific routes first
// ============================================================================

/**
 * @route   POST /api/business-item-option-groups
 * @desc    Create a new business item option group
 * @access  Private
 */
router.post(
  '/',
  createBusinessItemOptionGroupValidator,
  createBusinessItemOptionGroupController
);

/**
 * @route   POST /api/business-item-option-groups/bulk
 * @desc    Bulk create business item option groups
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/bulk',
  bulkCreateBusinessItemOptionGroupsValidator,
  bulkCreateBusinessItemOptionGroupsController
);

/**
 * @route   POST /api/business-item-option-groups/search/by-items
 * @desc    Search option groups by item IDs
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/search/by-items',
  getGroupsByItemsValidator,
  getGroupsByItemsController
);

// ============================================================================
// GET ROUTES - Specific routes first, then dynamic routes
// ============================================================================

/**
 * @route   GET /api/business-item-option-groups/count
 * @desc    Count business item option groups with optional filters
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', queryParamsValidator, countBusinessItemOptionGroupsController);

/**
 * @route   GET /api/business-item-option-groups/option/:optionId
 * @desc    Get an option group by optionId
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/option/:optionId',
  optionIdParamValidator,
  findBusinessItemOptionGroupByOptionIdController
);

/**
 * @route   GET /api/business-item-option-groups/item/:itemId
 * @desc    Get all option groups containing a specific item
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/item/:itemId',
  itemIdParamValidator,
  findBusinessItemOptionGroupsByItemIdController
);

/**
 * @route   GET /api/business-item-option-groups
 * @desc    Get all business item option groups with optional filters and pagination
 * @access  Public
 */
router.get('/', queryParamsValidator, findAllBusinessItemOptionGroupsController);

/**
 * @route   GET /api/business-item-option-groups/:id
 * @desc    Get a single business item option group by MongoDB ID
 * @access  Public
 * @note    Generic /:id route - comes AFTER all specific routes
 */
router.get('/:id', mongoIdParamValidator, findBusinessItemOptionGroupByIdController);

// ============================================================================
// OPTION GROUP ITEM MANAGEMENT ROUTES
// Routes for managing items within option groups (using optionId)
// ============================================================================

/**
 * @route   GET /api/business-item-option-groups/:optionId/items/count
 * @desc    Get the number of items in an option group
 * @access  Public
 */
router.get(
  '/:optionId/items/count',
  optionIdParamValidator,
  getItemCountController
);

/**
 * @route   GET /api/business-item-option-groups/:optionId/items/:itemId/exists
 * @desc    Check if an option group contains a specific item
 * @access  Public
 */
router.get(
  '/:optionId/items/:itemId/exists',
  hasItemValidator,
  hasItemController
);

/**
 * @route   POST /api/business-item-option-groups/:optionId/items
 * @desc    Add a single item to an option group
 * @access  Private
 */
router.post(
  '/:optionId/items',
  addItemValidator,
  addItemToGroupController
);

/**
 * @route   POST /api/business-item-option-groups/:optionId/items/bulk
 * @desc    Add multiple items to an option group
 * @access  Private
 */
router.post(
  '/:optionId/items/bulk',
  bulkItemsValidator,
  addMultipleItemsToGroupController
);

/**
 * @route   PUT /api/business-item-option-groups/:optionId/items
 * @desc    Replace all items in an option group
 * @access  Private
 */
router.put(
  '/:optionId/items',
  replaceItemsValidator,
  replaceAllItemsController
);

/**
 * @route   DELETE /api/business-item-option-groups/:optionId/items
 * @desc    Clear all items from an option group
 * @access  Private
 */
router.delete(
  '/:optionId/items',
  optionIdParamValidator,
  clearAllItemsController
);

/**
 * @route   DELETE /api/business-item-option-groups/:optionId/items/bulk
 * @desc    Remove multiple items from an option group
 * @access  Private
 */
router.delete(
  '/:optionId/items/bulk',
  bulkItemsValidator,
  removeMultipleItemsFromGroupController
);

/**
 * @route   DELETE /api/business-item-option-groups/:optionId/items/:itemId
 * @desc    Remove a single item from an option group
 * @access  Private
 */
router.delete(
  '/:optionId/items/:itemId',
  removeItemValidator,
  removeItemFromGroupController
);

// ============================================================================
// PATCH ROUTES - Option group updates
// ============================================================================

/**
 * @route   PATCH /api/business-item-option-groups/:optionId/description
 * @desc    Update the description of an option group
 * @access  Private
 */
router.patch(
  '/:optionId/description',
  updateDescriptionValidator,
  updateGroupDescriptionController
);

// ============================================================================
// PUT ROUTES - Full updates by MongoDB ID
// ============================================================================

/**
 * @route   PUT /api/business-item-option-groups/:id
 * @desc    Update a business item option group by MongoDB ID (full update)
 * @access  Private
 */
router.put(
  '/:id',
  updateBusinessItemOptionGroupValidator,
  updateBusinessItemOptionGroupController
);

// ============================================================================
// DELETE ROUTES - By MongoDB ID
// ============================================================================

/**
 * @route   DELETE /api/business-item-option-groups/:id
 * @desc    Delete a business item option group by MongoDB ID
 * @access  Private
 */
router.delete('/:id', mongoIdParamValidator, deleteBusinessItemOptionGroupController);

export default router;
