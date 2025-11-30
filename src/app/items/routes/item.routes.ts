/**
 * Business Item Routes
 * Defines all API endpoints for business item management
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /bulk, /search, /vegan) MUST come BEFORE dynamic routes (e.g., /:id)
 * - Otherwise Express will match /search as /:id with id="search"
 */

import { Router } from 'express';
import {
  createItemController,
  updateItemController,
  deleteItemController,
  findAllItemsController,
  findItemByIdController,
  bulkCreateItemsController,
  countItemsController,
  findItemBySkuController,
  findItemByBarcodeController,
  findItemsByBusinessIdController,
  findItemsByTypeController,
  findItemsByCategoryController,
  findAvailableItemsController,
  findFeaturedItemsController,
  findVeganItemsController,
  findVegetarianItemsController,
  findHalalItemsController,
  findGlutenFreeItemsController,
  searchItemsController,
  setItemAvailabilityController,
  makeItemAvailableController,
  makeItemUnavailableController,
  setItemFeaturedController,
  featureItemController,
  unfeatureItemController,
  updateStockController,
  incrementStockController,
  decrementStockController,
  findLowStockItemsController,
} from '../controllers/index.js';
import {
  createItemValidator,
  updateItemValidator,
  itemIdValidator,
  businessIdParamValidator,
  bulkCreateItemsValidator,
  searchItemsValidator,
  itemTypeValidator,
  itemCategoryValidator,
  skuValidator,
  barcodeValidator,
  setAvailabilityValidator,
  setFeaturedValidator,
  updateStockValidator,
  incrementStockValidator,
  decrementStockValidator,
  queryParamsValidator,
} from '../validators/index.js';

const router = Router();

// ============================================================================
// POST ROUTES - Specific routes first
// ============================================================================

/**
 * @route   POST /api/items
 * @desc    Create a new business item
 * @access  Private (Business owner)
 */
router.post('/', createItemValidator, createItemController);

/**
 * @route   POST /api/items/bulk
 * @desc    Bulk create business items
 * @access  Private (Business owner)
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/bulk',
  bulkCreateItemsValidator,
  bulkCreateItemsController
);

/**
 * @route   POST /api/items/search
 * @desc    Search business items with advanced criteria
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.post('/search', searchItemsValidator, searchItemsController);

// ============================================================================
// GET ROUTES - Specific routes first, then dynamic routes
// ============================================================================

/**
 * @route   GET /api/items/count
 * @desc    Count business items with optional filters
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', queryParamsValidator, countItemsController);

/**
 * @route   GET /api/items/available
 * @desc    Get all available items
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/available', queryParamsValidator, findAvailableItemsController);

/**
 * @route   GET /api/items/featured
 * @desc    Get all featured items
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/featured', queryParamsValidator, findFeaturedItemsController);

/**
 * @route   GET /api/items/vegan
 * @desc    Get all vegan items
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/vegan', queryParamsValidator, findVeganItemsController);

/**
 * @route   GET /api/items/vegetarian
 * @desc    Get all vegetarian items
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/vegetarian', queryParamsValidator, findVegetarianItemsController);

/**
 * @route   GET /api/items/halal
 * @desc    Get all halal items
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/halal', queryParamsValidator, findHalalItemsController);

/**
 * @route   GET /api/items/gluten-free
 * @desc    Get all gluten-free items
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/gluten-free', queryParamsValidator, findGlutenFreeItemsController);

/**
 * @route   GET /api/items/low-stock
 * @desc    Get items with low stock
 * @access  Private (Business owner)
 * @note    Must come BEFORE /:id routes
 */
router.get('/low-stock', queryParamsValidator, findLowStockItemsController);

/**
 * @route   GET /api/items/sku/:sku
 * @desc    Get an item by SKU
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/sku/:sku', skuValidator, findItemBySkuController);

/**
 * @route   GET /api/items/barcode/:barcode
 * @desc    Get an item by barcode
 * @access  Public
 * @note    Must come BEFORE /:id routes
 */
router.get('/barcode/:barcode', barcodeValidator, findItemByBarcodeController);

/**
 * @route   GET /api/items/business/:businessId
 * @desc    Get all items for a specific business
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/business/:businessId',
  businessIdParamValidator,
  findItemsByBusinessIdController
);

/**
 * @route   GET /api/items/type/:type
 * @desc    Get all items of a specific type
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get('/type/:type', itemTypeValidator, findItemsByTypeController);

/**
 * @route   GET /api/items/category/:category
 * @desc    Get all items of a specific category
 * @access  Public
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/category/:category',
  itemCategoryValidator,
  findItemsByCategoryController
);

/**
 * @route   GET /api/items
 * @desc    Get all business items with optional filters and pagination
 * @access  Public
 */
router.get('/', queryParamsValidator, findAllItemsController);

/**
 * @route   GET /api/items/:id
 * @desc    Get a single business item by ID
 * @access  Public
 * @note    Generic /:id route - comes AFTER all specific routes
 */
router.get('/:id', itemIdValidator, findItemByIdController);

// ============================================================================
// PATCH ROUTES - Specific :id sub-routes first, then generic /:id
// ============================================================================

/**
 * @route   PATCH /api/items/:id/availability
 * @desc    Set item availability status
 * @access  Private (Business owner)
 */
router.patch(
  '/:id/availability',
  setAvailabilityValidator,
  setItemAvailabilityController
);

/**
 * @route   PATCH /api/items/:id/make-available
 * @desc    Make an item available
 * @access  Private (Business owner)
 */
router.patch(
  '/:id/make-available',
  itemIdValidator,
  makeItemAvailableController
);

/**
 * @route   PATCH /api/items/:id/make-unavailable
 * @desc    Make an item unavailable
 * @access  Private (Business owner)
 */
router.patch(
  '/:id/make-unavailable',
  itemIdValidator,
  makeItemUnavailableController
);

/**
 * @route   PATCH /api/items/:id/featured
 * @desc    Set item featured status
 * @access  Private (Business owner)
 */
router.patch('/:id/featured', setFeaturedValidator, setItemFeaturedController);

/**
 * @route   PATCH /api/items/:id/feature
 * @desc    Feature an item
 * @access  Private (Business owner)
 */
router.patch('/:id/feature', itemIdValidator, featureItemController);

/**
 * @route   PATCH /api/items/:id/unfeature
 * @desc    Unfeature an item
 * @access  Private (Business owner)
 */
router.patch('/:id/unfeature', itemIdValidator, unfeatureItemController);

/**
 * @route   PATCH /api/items/:id/stock
 * @desc    Set item stock quantity
 * @access  Private (Business owner)
 */
router.patch('/:id/stock', updateStockValidator, updateStockController);

/**
 * @route   PATCH /api/items/:id/stock/increment
 * @desc    Increment item stock
 * @access  Private (Business owner)
 */
router.patch(
  '/:id/stock/increment',
  incrementStockValidator,
  incrementStockController
);

/**
 * @route   PATCH /api/items/:id/stock/decrement
 * @desc    Decrement item stock
 * @access  Private (Business owner)
 */
router.patch(
  '/:id/stock/decrement',
  decrementStockValidator,
  decrementStockController
);

/**
 * @route   PATCH /api/items/:id
 * @desc    Update a business item by ID
 * @access  Private (Business owner)
 * @note    Generic /:id route - comes AFTER specific :id sub-routes
 */
router.patch('/:id', updateItemValidator, updateItemController);

// ============================================================================
// PUT ROUTES (Alternative to PATCH for full updates)
// ============================================================================

/**
 * @route   PUT /api/items/:id
 * @desc    Update a business item by ID (full update)
 * @access  Private (Business owner)
 */
router.put('/:id', updateItemValidator, updateItemController);

// ============================================================================
// DELETE ROUTES
// ============================================================================

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete a business item by ID
 * @access  Private (Business owner)
 */
router.delete('/:id', itemIdValidator, deleteItemController);

export default router;
