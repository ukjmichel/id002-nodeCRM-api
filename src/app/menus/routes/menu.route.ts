/**
 * Menu Routes
 * Defines all API endpoints for menu management
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /bulk, /search, /count) MUST come BEFORE dynamic routes (e.g., /:id)
 * - Otherwise Express will match /search as /:id with id="search"
 */

import { Router } from 'express';
import {
  // CRUD Controllers
  createMenuController,
  findAllMenusController,
  findMenuByIdController,
  findMenuByMenuIdController,
  updateMenuController,
  deleteMenuController,
  countMenusController,
  // Search Controllers
  findMenusByNameController,
  findMenusByItemIdController,
  // Item Management Controllers
  addItemToMenuController,
  removeItemFromMenuController,
  updateMenuItemController,
  bulkAddItemsToMenuController,
  clearMenuItemsController,
  replaceMenuItemsController,
  // Item Query Controllers
  getMenuItemController,
  hasMenuItemController,
  getMenuItemCountController,
  getItemsWithOptionsController,
  getItemsWithoutOptionsController,
  // Active Option Controllers
  addActiveItemToMenuController,
  addActiveOptionToMenuController,
  addActiveOptionToMenuItemController,
  addActiveOptionsToMenuController,
  getActiveOptionsForMenuController,
  removeInactiveOptionsFromMenuController,
  syncActiveOptionsForMenuController,
} from '../controllers/index.js';

const router = Router();

// ============================================================================
// CRUD ROUTES
// ============================================================================

/**
 * @route   POST /api/menus
 * @desc    Create a new menu
 * @access  Private
 */
router.post('/', createMenuController);

/**
 * @route   GET /api/menus
 * @desc    Get all menus with optional filters and pagination
 * @access  Public
 */
router.get('/', findAllMenusController);

/**
 * @route   GET /api/menus/count
 * @desc    Count menus with optional filters
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', countMenusController);

/**
 * @route   GET /api/menus/by-menu-id/:menuId
 * @desc    Get a menu by custom menuId
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get('/by-menu-id/:menuId', findMenuByMenuIdController);

/**
 * @route   GET /api/menus/:id
 * @desc    Get a single menu by MongoDB ID
 * @access  Public
 */
router.get('/:id', findMenuByIdController);

/**
 * @route   PUT /api/menus/:id
 * @desc    Update a menu by MongoDB ID
 * @access  Private
 */
router.put('/:id', updateMenuController);

/**
 * @route   DELETE /api/menus/:id
 * @desc    Delete a menu by MongoDB ID
 * @access  Private
 */
router.delete('/:id', deleteMenuController);

// ============================================================================
// SEARCH ROUTES
// ============================================================================

/**
 * @route   GET /api/menus/search/by-name
 * @desc    Search menus by name
 * @access  Public
 * @query   name: string
 */
router.get('/search/by-name', findMenusByNameController);

/**
 * @route   GET /api/menus/search/by-item/:itemId
 * @desc    Get all menus containing a specific item
 * @access  Public
 */
router.get('/search/by-item/:itemId', findMenusByItemIdController);

// ============================================================================
// ITEM MANAGEMENT ROUTES
// ============================================================================

/**
 * @route   POST /api/menus/:id/items
 * @desc    Add a single item to a menu
 * @access  Private
 * @body    { itemId: string, quantity?: number, allowOptions?: boolean }
 */
router.post('/:id/items', addItemToMenuController);

/**
 * @route   POST /api/menus/:id/items/bulk
 * @desc    Add multiple items to a menu
 * @access  Private
 * @body    { items: [{ itemId: string, quantity?: number, allowOptions?: boolean }] }
 */
router.post('/:id/items/bulk', bulkAddItemsToMenuController);

/**
 * @route   PUT /api/menus/:id/items
 * @desc    Replace all items in a menu
 * @access  Private
 * @body    { items: [{ itemId: string, quantity?: number, allowOptions?: boolean }] }
 */
router.put('/:id/items', replaceMenuItemsController);

/**
 * @route   DELETE /api/menus/:id/items
 * @desc    Clear all items from a menu
 * @access  Private
 */
router.delete('/:id/items', clearMenuItemsController);

/**
 * @route   DELETE /api/menus/:id/items/:itemId
 * @desc    Remove a single item from a menu
 * @access  Private
 */
router.delete('/:id/items/:itemId', removeItemFromMenuController);

/**
 * @route   PUT /api/menus/:id/items/:itemId
 * @desc    Update a specific item in a menu
 * @access  Private
 * @body    { quantity?: number, allowOptions?: boolean }
 */
router.put('/:id/items/:itemId', updateMenuItemController);

// ============================================================================
// ITEM QUERY ROUTES
// ============================================================================

/**
 * @route   GET /api/menus/:id/items/count
 * @desc    Get the number of items in a menu
 * @access  Public
 */
router.get('/:id/items/count', getMenuItemCountController);

/**
 * @route   GET /api/menus/:id/items/with-options
 * @desc    Get items that allow options
 * @access  Public
 */
router.get('/:id/items/with-options', getItemsWithOptionsController);

/**
 * @route   GET /api/menus/:id/items/without-options
 * @desc    Get items that don't allow options
 * @access  Public
 */
router.get('/:id/items/without-options', getItemsWithoutOptionsController);

/**
 * @route   GET /api/menus/:id/items/:itemId/exists
 * @desc    Check if a menu contains a specific item
 * @access  Public
 */
router.get('/:id/items/:itemId/exists', hasMenuItemController);

/**
 * @route   GET /api/menus/:id/items/:itemId
 * @desc    Get details of a specific item in a menu
 * @access  Public
 */
router.get('/:id/items/:itemId', getMenuItemController);

// ============================================================================
// ACTIVE OPTIONS ROUTES
// Routes for managing active options on menus and menu items
// ============================================================================

/**
 * @route   POST /api/menus/:menuId/active-items
 * @desc    Add an item to menu if it's active in an option group
 * @access  Private
 * @body    { optionId: string, itemId: string }
 */
router.post('/:menuId/active-items', addActiveItemToMenuController);

/**
 * @route   GET /api/menus/:menuId/active-options
 * @desc    Get all active option groups for a menu
 * @access  Public
 * @query   includeInactiveItems?: boolean
 */
router.get('/:menuId/active-options', getActiveOptionsForMenuController);

/**
 * @route   POST /api/menus/:menuId/active-options
 * @desc    Add an active option group to a menu
 * @access  Private
 * @body    { optionId: string }
 */
router.post('/:menuId/active-options', addActiveOptionToMenuController);

/**
 * @route   POST /api/menus/:menuId/active-options/bulk
 * @desc    Add multiple active option groups to a menu
 * @access  Private
 * @body    { optionIds: string[], required?: boolean }
 */
router.post('/:menuId/active-options/bulk', addActiveOptionsToMenuController);

/**
 * @route   POST /api/menus/:menuId/active-options/sync
 * @desc    Sync menu's option groups with current active state
 * @access  Private
 */
router.post('/:menuId/active-options/sync', syncActiveOptionsForMenuController);

/**
 * @route   DELETE /api/menus/:menuId/inactive-options
 * @desc    Remove all option groups that have no active items
 * @access  Private
 */
router.delete(
  '/:menuId/inactive-options',
  removeInactiveOptionsFromMenuController
);

/**
 * @route   POST /api/menus/:menuId/items/:itemId/active-options
 * @desc    Add an active option to a specific item in a menu
 * @access  Private
 * @body    { optionId: string }
 */
router.post(
  '/:menuId/items/:itemId/active-options',
  addActiveOptionToMenuItemController
);

export default router;
