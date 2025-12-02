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
  updateMenuController,
  deleteMenuController,
  bulkCreateMenusController,
  countMenusController,
  // Find Controllers
  findMenuByMenuIdController,
  findMenusByItemIdController,
  findMenusByNameController,
  getMenusByItemsController,
  // Item Management Controllers
  addItemToMenuController,
  addMultipleItemsToMenuController,
  removeItemFromMenuController,
  removeMultipleItemsFromMenuController,
  clearAllItemsController,
  replaceAllItemsController,
  // Query Controllers
  hasItemController,
  getItemCountController,
  getItemDetailsController,
  // Update Controllers
  updateMenuNameController,
  updateMenuDescriptionController,
  updateItemQuantityController,
  bulkUpdateItemsController,
  // Active Options Controllers
  addActiveOptionController,
  removeActiveOptionController,
  getActiveOptionsController,
  setActiveOptionsController,
  // Default Items Controllers
  addDefaultItemController,
  removeDefaultItemController,
  getDefaultItemsController,
  setDefaultItemsController,
} from '../controllers/index.js';
import {
  // ID Validators
  menuIdParamValidator,
  itemIdParamValidator,
  mongoIdParamValidator,
  // CRUD Validators
  createMenuValidator,
  updateMenuValidator,
  bulkCreateMenusValidator,
  // Item Management Validators
  addItemValidator,
  removeItemValidator,
  bulkItemsValidator,
  replaceItemsValidator,
  bulkUpdateItemsValidator,
  // Query Validators
  hasItemValidator,
  getMenusByItemsValidator,
  queryParamsValidator,
  // Update Validators
  updateNameValidator,
  updateDescriptionValidator,
  updateQuantityValidator,
  // Active Options Validators
  addActiveOptionValidator,
  removeActiveOptionValidator,
  getActiveOptionsValidator,
  setActiveOptionsValidator,
  // Default Items Validators
  addDefaultItemValidator,
  removeDefaultItemValidator,
  getDefaultItemsValidator,
  setDefaultItemsValidator,
} from '../validators/index.js';

const router = Router();

// ============================================================================
// POST ROUTES - Specific routes first
// ============================================================================

/**
 * @route   POST /api/menus
 * @desc    Create a new menu
 * @access  Private
 */
router.post('/', createMenuValidator, createMenuController);

/**
 * @route   POST /api/menus/bulk
 * @desc    Bulk create menus
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.post('/bulk', bulkCreateMenusValidator, bulkCreateMenusController);

/**
 * @route   POST /api/menus/search/by-items
 * @desc    Search menus by item IDs
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/search/by-items',
  getMenusByItemsValidator,
  getMenusByItemsController
);

// ============================================================================
// GET ROUTES - Specific routes first, then dynamic routes
// ============================================================================

/**
 * @route   GET /api/menus/count
 * @desc    Count menus with optional filters
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', queryParamsValidator, countMenusController);

/**
 * @route   GET /api/menus/menu/:menuId
 * @desc    Get a menu by menuId
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get('/menu/:menuId', menuIdParamValidator, findMenuByMenuIdController);

/**
 * @route   GET /api/menus/item/:itemId
 * @desc    Get all menus containing a specific item
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get('/item/:itemId', itemIdParamValidator, findMenusByItemIdController);

/**
 * @route   GET /api/menus/name/:name
 * @desc    Get menus by name (partial match)
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get('/name/:name', findMenusByNameController);

/**
 * @route   GET /api/menus
 * @desc    Get all menus with optional filters and pagination
 * @access  Public
 */
router.get('/', queryParamsValidator, findAllMenusController);

/**
 * @route   GET /api/menus/:id
 * @desc    Get a single menu by MongoDB ID
 * @access  Public
 * @note    Generic /:id route - comes AFTER all specific routes
 */
router.get('/:id', mongoIdParamValidator, findMenuByIdController);

// ============================================================================
// MENU ITEM MANAGEMENT ROUTES
// Routes for managing items within menus (using menuId)
// ============================================================================

/**
 * @route   GET /api/menus/:menuId/items/count
 * @desc    Get the number of items in a menu
 * @access  Public
 */
router.get(
  '/:menuId/items/count',
  menuIdParamValidator,
  getItemCountController
);

/**
 * @route   GET /api/menus/:menuId/items/:itemId/exists
 * @desc    Check if a menu contains a specific item
 * @access  Public
 */
router.get(
  '/:menuId/items/:itemId/exists',
  hasItemValidator,
  hasItemController
);

/**
 * @route   GET /api/menus/:menuId/items/:itemId
 * @desc    Get details of a specific item in a menu
 * @access  Public
 */
router.get(
  '/:menuId/items/:itemId',
  hasItemValidator,
  getItemDetailsController
);

/**
 * @route   POST /api/menus/:menuId/items
 * @desc    Add a single item to a menu
 * @access  Private
 * @body    { itemId: string, quantity?: number, activeOptions?: string[], defaultItems?: string[] }
 */
router.post('/:menuId/items', addItemValidator, addItemToMenuController);

/**
 * @route   POST /api/menus/:menuId/items/bulk
 * @desc    Add multiple items to a menu
 * @access  Private
 * @body    { itemIds: string[], defaultQuantity?: number, defaultActiveOptions?: string[], defaultDefaultItems?: string[] }
 */
router.post(
  '/:menuId/items/bulk',
  bulkItemsValidator,
  addMultipleItemsToMenuController
);

/**
 * @route   PUT /api/menus/:menuId/items
 * @desc    Replace all items in a menu
 * @access  Private
 * @body    { itemIds: string[], defaultQuantity?: number, defaultActiveOptions?: string[], defaultDefaultItems?: string[] }
 */
router.put('/:menuId/items', replaceItemsValidator, replaceAllItemsController);

/**
 * @route   DELETE /api/menus/:menuId/items
 * @desc    Clear all items from a menu
 * @access  Private
 */
router.delete('/:menuId/items', menuIdParamValidator, clearAllItemsController);

/**
 * @route   DELETE /api/menus/:menuId/items/bulk
 * @desc    Remove multiple items from a menu
 * @access  Private
 * @body    { itemIds: string[] }
 */
router.delete(
  '/:menuId/items/bulk',
  bulkItemsValidator,
  removeMultipleItemsFromMenuController
);

/**
 * @route   DELETE /api/menus/:menuId/items/:itemId
 * @desc    Remove a single item from a menu
 * @access  Private
 */
router.delete(
  '/:menuId/items/:itemId',
  removeItemValidator,
  removeItemFromMenuController
);

// ============================================================================
// ACTIVE OPTIONS ROUTES
// Routes for managing active options on items within menus
// ============================================================================

/**
 * @route   GET /api/menus/:menuId/items/:itemId/active-options
 * @desc    Get all active options for an item in a menu
 * @access  Public
 */
router.get(
  '/:menuId/items/:itemId/active-options',
  getActiveOptionsValidator,
  getActiveOptionsController
);

/**
 * @route   POST /api/menus/:menuId/items/:itemId/active-options
 * @desc    Add an active option to an item in a menu
 * @access  Private
 * @body    { optionId: string }
 */
router.post(
  '/:menuId/items/:itemId/active-options',
  addActiveOptionValidator,
  addActiveOptionController
);

/**
 * @route   PUT /api/menus/:menuId/items/:itemId/active-options
 * @desc    Set all active options for an item in a menu (replaces existing)
 * @access  Private
 * @body    { optionIds: string[] }
 */
router.put(
  '/:menuId/items/:itemId/active-options',
  setActiveOptionsValidator,
  setActiveOptionsController
);

/**
 * @route   DELETE /api/menus/:menuId/items/:itemId/active-options/:optionId
 * @desc    Remove an active option from an item in a menu
 * @access  Private
 */
router.delete(
  '/:menuId/items/:itemId/active-options/:optionId',
  removeActiveOptionValidator,
  removeActiveOptionController
);

// ============================================================================
// DEFAULT ITEMS ROUTES
// Routes for managing default items on items within menus
// ============================================================================

/**
 * @route   GET /api/menus/:menuId/items/:itemId/default-items
 * @desc    Get all default items for an item in a menu
 * @access  Public
 */
router.get(
  '/:menuId/items/:itemId/default-items',
  getDefaultItemsValidator,
  getDefaultItemsController
);

/**
 * @route   POST /api/menus/:menuId/items/:itemId/default-items
 * @desc    Add a default item to an item in a menu
 * @access  Private
 * @body    { defaultItemId: string }
 */
router.post(
  '/:menuId/items/:itemId/default-items',
  addDefaultItemValidator,
  addDefaultItemController
);

/**
 * @route   PUT /api/menus/:menuId/items/:itemId/default-items
 * @desc    Set all default items for an item in a menu (replaces existing)
 * @access  Private
 * @body    { defaultItemIds: string[] }
 */
router.put(
  '/:menuId/items/:itemId/default-items',
  setDefaultItemsValidator,
  setDefaultItemsController
);

/**
 * @route   DELETE /api/menus/:menuId/items/:itemId/default-items/:defaultItemId
 * @desc    Remove a default item from an item in a menu
 * @access  Private
 */
router.delete(
  '/:menuId/items/:itemId/default-items/:defaultItemId',
  removeDefaultItemValidator,
  removeDefaultItemController
);

// ============================================================================
// PATCH ROUTES - Menu and item updates
// ============================================================================

/**
 * @route   PATCH /api/menus/:menuId/name
 * @desc    Update the name of a menu
 * @access  Private
 * @body    { name: string }
 */
router.patch('/:menuId/name', updateNameValidator, updateMenuNameController);

/**
 * @route   PATCH /api/menus/:menuId/description
 * @desc    Update the description of a menu
 * @access  Private
 * @body    { description: string }
 */
router.patch(
  '/:menuId/description',
  updateDescriptionValidator,
  updateMenuDescriptionController
);

/**
 * @route   PATCH /api/menus/:menuId/items/bulk
 * @desc    Bulk update items in a menu (quantity, activeOptions, defaultItems)
 * @access  Private
 * @body    { updates: [{ itemId: string, quantity?: number, activeOptions?: string[], defaultItems?: string[] }] }
 */
router.patch(
  '/:menuId/items/bulk',
  bulkUpdateItemsValidator,
  bulkUpdateItemsController
);

/**
 * @route   PATCH /api/menus/:menuId/items/:itemId/quantity
 * @desc    Update the quantity of an item in a menu
 * @access  Private
 * @body    { quantity: number }
 */
router.patch(
  '/:menuId/items/:itemId/quantity',
  updateQuantityValidator,
  updateItemQuantityController
);

// ============================================================================
// PUT ROUTES - Full updates by MongoDB ID
// ============================================================================

/**
 * @route   PUT /api/menus/:id
 * @desc    Update a menu by MongoDB ID (full update)
 * @access  Private
 */
router.put('/:id', updateMenuValidator, updateMenuController);

// ============================================================================
// DELETE ROUTES - By MongoDB ID
// ============================================================================

/**
 * @route   DELETE /api/menus/:id
 * @desc    Delete a menu by MongoDB ID
 * @access  Private
 */
router.delete('/:id', mongoIdParamValidator, deleteMenuController);

export default router;
