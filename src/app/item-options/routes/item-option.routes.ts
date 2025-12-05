/**
 * Item Option Routes
 * Defines all API endpoints for item-option relationship management
 * Manages the junction table between Items (SQL) and OptionGroups (MongoDB)
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /count, /required, /reorder) MUST come BEFORE dynamic routes
 * - Otherwise Express will match /count as /:optionId with optionId="count"
 */

import { Router } from 'express';
import {
  // Add/Create Controllers
  addOptionToItemController,
  bulkAddOptionsToItemController,
  // Remove Controllers
  removeOptionFromItemController,
  removeAllOptionsFromItemController,
  // Find Controllers
  findOptionsByItemIdController,
  findItemsByOptionIdController,
  findItemOptionController,
  // Update Controllers
  updateItemOptionController,
  replaceItemOptionsController,
  setOptionRequiredController,
  updateSortOrderController,
  reorderOptionsController,
  // Query Controllers
  hasOptionController,
  getOptionCountController,
  getRequiredOptionsController,
} from '../controllers/item-options/index.js';
import {
  // Parameter Validators
  itemIdParamValidator,
  optionIdParamValidator,
  itemOptionParamsValidator,
  // Add/Create Validators
  addOptionToItemValidator,
  bulkAddOptionsToItemValidator,
  // Update Validators
  updateItemOptionValidator,
  replaceItemOptionsValidator,
  setOptionRequiredValidator,
  updateSortOrderValidator,
  reorderOptionsValidator,
} from '../validators/item-options/index.js';

const router = Router();

// ============================================================================
// ROUTES BY OPTION ID (MongoDB ObjectId)
// Get all items that have a specific option group
// ============================================================================

/**
 * @route   GET /api/item-options/by-option/:optionId
 * @desc    Get all items that have a specific option group
 * @access  Public
 */
router.get(
  '/by-option/:optionId',
  optionIdParamValidator,
  findItemsByOptionIdController
);

// ============================================================================
// ROUTES BY ITEM ID
// All routes below operate on a specific item's options
// ============================================================================

/**
 * @route   GET /api/item-options/:itemId/options/count
 * @desc    Get the count of option groups for an item
 * @access  Public
 * @note    Must come BEFORE /:itemId/options/:optionId routes
 */
router.get(
  '/:itemId/options/count',
  itemIdParamValidator,
  getOptionCountController
);

/**
 * @route   GET /api/item-options/:itemId/options/required
 * @desc    Get all required option groups for an item
 * @access  Public
 * @note    Must come BEFORE /:itemId/options/:optionId routes
 */
router.get(
  '/:itemId/options/required',
  itemIdParamValidator,
  getRequiredOptionsController
);

/**
 * @route   POST /api/item-options/:itemId/options/bulk
 * @desc    Add multiple option groups to an item
 * @access  Private
 * @body    { options: [{ optionId, sortOrder?, isRequired? }] }
 * @note    Must come BEFORE /:itemId/options/:optionId routes
 */
router.post(
  '/:itemId/options/bulk',
  bulkAddOptionsToItemValidator,
  bulkAddOptionsToItemController
);

/**
 * @route   PATCH /api/item-options/:itemId/options/reorder
 * @desc    Reorder all option groups for an item
 * @access  Private
 * @body    { optionIds: string[] }
 * @note    Must come BEFORE /:itemId/options/:optionId routes
 */
router.patch(
  '/:itemId/options/reorder',
  reorderOptionsValidator,
  reorderOptionsController
);

/**
 * @route   GET /api/item-options/:itemId/options
 * @desc    Get all option groups for an item
 * @access  Public
 */
router.get(
  '/:itemId/options',
  itemIdParamValidator,
  findOptionsByItemIdController
);

/**
 * @route   POST /api/item-options/:itemId/options
 * @desc    Add a single option group to an item
 * @access  Private
 * @body    { optionId, sortOrder?, isRequired? }
 */
router.post(
  '/:itemId/options',
  addOptionToItemValidator,
  addOptionToItemController
);

/**
 * @route   PUT /api/item-options/:itemId/options
 * @desc    Replace all option groups for an item
 * @access  Private
 * @body    { options: [{ optionId, sortOrder?, isRequired? }] }
 */
router.put(
  '/:itemId/options',
  replaceItemOptionsValidator,
  replaceItemOptionsController
);

/**
 * @route   DELETE /api/item-options/:itemId/options
 * @desc    Remove all option groups from an item
 * @access  Private
 */
router.delete(
  '/:itemId/options',
  itemIdParamValidator,
  removeAllOptionsFromItemController
);

// ============================================================================
// ROUTES FOR SPECIFIC ITEM-OPTION RELATIONSHIP
// Routes with both itemId and optionId parameters
// ============================================================================

/**
 * @route   GET /api/item-options/:itemId/options/:optionId/exists
 * @desc    Check if an item has a specific option group
 * @access  Public
 * @note    Must come BEFORE /:itemId/options/:optionId GET route
 */
router.get(
  '/:itemId/options/:optionId/exists',
  itemOptionParamsValidator,
  hasOptionController
);

/**
 * @route   PATCH /api/item-options/:itemId/options/:optionId/required
 * @desc    Set the required status of an option group for an item
 * @access  Private
 * @body    { isRequired: boolean }
 * @note    Must come BEFORE /:itemId/options/:optionId PATCH route
 */
router.patch(
  '/:itemId/options/:optionId/required',
  setOptionRequiredValidator,
  setOptionRequiredController
);

/**
 * @route   PATCH /api/item-options/:itemId/options/:optionId/sort-order
 * @desc    Update the sort order of an option group for an item
 * @access  Private
 * @body    { sortOrder: number }
 * @note    Must come BEFORE /:itemId/options/:optionId PATCH route
 */
router.patch(
  '/:itemId/options/:optionId/sort-order',
  updateSortOrderValidator,
  updateSortOrderController
);

/**
 * @route   GET /api/item-options/:itemId/options/:optionId
 * @desc    Get a specific item-option relationship
 * @access  Public
 */
router.get(
  '/:itemId/options/:optionId',
  itemOptionParamsValidator,
  findItemOptionController
);

/**
 * @route   PATCH /api/item-options/:itemId/options/:optionId
 * @desc    Update an item-option relationship
 * @access  Private
 * @body    { sortOrder?, isRequired? }
 */
router.patch(
  '/:itemId/options/:optionId',
  updateItemOptionValidator,
  updateItemOptionController
);

/**
 * @route   DELETE /api/item-options/:itemId/options/:optionId
 * @desc    Remove a specific option group from an item
 * @access  Private
 */
router.delete(
  '/:itemId/options/:optionId',
  itemOptionParamsValidator,
  removeOptionFromItemController
);

export default router;
