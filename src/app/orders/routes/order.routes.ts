/**
 * =============================================================================
 * Order Routes
 * =============================================================================
 * Defines all routes for order management
 * Base path: /api/orders
 * =============================================================================
 */

import { Router } from 'express';
import {
  // CRUD
  createOrderController,
  findOrderByIdController,
  findOrderByOrderIdController,
  findAllOrdersController,
  updateOrderController,
  deleteOrderController,
  countOrdersController,

  // Search
  findOrdersByUserIdController,
  findOrdersByBusinessIdController,
  findOrdersByStatusController,
  findOrdersByFulfillmentStatusController,
  findPendingOrdersController,
  findActiveOrdersController,
  findOrdersByDriverIdController,

  // Status
  updateOrderStatusController,
  updateFulfillmentStatusController,
  cancelOrderController,

  // Payment
  markOrderAsPaidController,
  refundOrderController,

  // Driver
  assignDriverController,
  updateDriverLocationController,

  // Items
  addItemToOrderController,
  removeItemFromOrderController,
  updateOrderItemQuantityController,

  // Statistics
  getOrderStatsController,
} from '../controllers/index.js';

import {
  // Param validators
  orderIdParamValidator,
  orderIdStringParamValidator,
  userIdParamValidator,
  businessIdParamValidator,
  driverIdParamValidator,
  itemIdParamValidator,
  statusParamValidator,
  fulfillmentStatusParamValidator,

  // Body validators
  createOrderValidator,
  updateOrderValidator,
  updateOrderStatusValidator,
  updateFulfillmentStatusValidator,
  cancelOrderValidator,
  markOrderAsPaidValidator,
  refundOrderValidator,
  assignDriverValidator,
  updateDriverLocationValidator,
  addItemToOrderValidator,
  updateOrderItemQuantityValidator,

  // Query validators
  paginationQueryValidator,
} from '../validators/index.js';

const router = Router();

// =============================================================================
// STATISTICS & AGGREGATE ROUTES (must be before :id routes)
// =============================================================================

/**
 * @route GET /api/orders/stats
 * @desc Get order statistics
 * @access Private
 */
router.get('/stats', getOrderStatsController);

/**
 * @route GET /api/orders/count
 * @desc Count orders with filters
 * @access Private
 */
router.get('/count', countOrdersController);

/**
 * @route GET /api/orders/pending
 * @desc Get all pending orders
 * @access Private
 */
router.get('/pending', paginationQueryValidator, findPendingOrdersController);

/**
 * @route GET /api/orders/active
 * @desc Get all active orders
 * @access Private
 */
router.get(
  '/active',
  paginationQueryValidator,

  findActiveOrdersController
);

// =============================================================================
// SEARCH ROUTES (must be before :id routes)
// =============================================================================

/**
 * @route GET /api/orders/by-order-id/:orderId
 * @desc Get order by orderId (e.g., ORD-20240101-00001)
 * @access Private
 */
router.get(
  '/by-order-id/:orderId',
  orderIdStringParamValidator,

  findOrderByOrderIdController
);

/**
 * @route GET /api/orders/by-user/:userId
 * @desc Get all orders for a user
 * @access Private
 */
router.get(
  '/by-user/:userId',
  userIdParamValidator,
  paginationQueryValidator,

  findOrdersByUserIdController
);

/**
 * @route GET /api/orders/by-business/:businessId
 * @desc Get all orders for a business
 * @access Private
 */
router.get(
  '/by-business/:businessId',
  businessIdParamValidator,
  paginationQueryValidator,

  findOrdersByBusinessIdController
);

/**
 * @route GET /api/orders/by-status/:status
 * @desc Get all orders with a specific status
 * @access Private
 */
router.get(
  '/by-status/:status',
  statusParamValidator,
  paginationQueryValidator,

  findOrdersByStatusController
);

/**
 * @route GET /api/orders/by-fulfillment-status/:status
 * @desc Get all orders with a specific fulfillment status
 * @access Private
 */
router.get(
  '/by-fulfillment-status/:status',
  fulfillmentStatusParamValidator,
  paginationQueryValidator,

  findOrdersByFulfillmentStatusController
);

/**
 * @route GET /api/orders/by-driver/:driverId
 * @desc Get all orders assigned to a driver
 * @access Private
 */
router.get(
  '/by-driver/:driverId',
  driverIdParamValidator,
  paginationQueryValidator,

  findOrdersByDriverIdController
);

// =============================================================================
// CRUD ROUTES
// =============================================================================

/**
 * @route GET /api/orders
 * @desc Get all orders with filters and pagination
 * @access Private
 */
router.get(
  '/',
  paginationQueryValidator,

  findAllOrdersController
);

/**
 * @route POST /api/orders
 * @desc Create a new order
 * @access Private
 */
router.post(
  '/',
  createOrderValidator,

  createOrderController
);

/**
 * @route GET /api/orders/:id
 * @desc Get order by MongoDB _id
 * @access Private
 */
router.get('/:id', orderIdParamValidator, findOrderByIdController);

/**
 * @route PATCH /api/orders/:id
 * @desc Update an order
 * @access Private
 */
router.patch(
  '/:id',
  orderIdParamValidator,
  updateOrderValidator,

  updateOrderController
);

/**
 * @route DELETE /api/orders/:id
 * @desc Delete an order (only cancelled/refunded)
 * @access Private
 */
router.delete(
  '/:id',
  orderIdParamValidator,

  deleteOrderController
);

// =============================================================================
// STATUS ROUTES
// =============================================================================

/**
 * @route PATCH /api/orders/:id/status
 * @desc Update order status
 * @access Private
 */
router.patch(
  '/:id/status',
  orderIdParamValidator,
  updateOrderStatusValidator,

  updateOrderStatusController
);

/**
 * @route PATCH /api/orders/:id/fulfillment-status
 * @desc Update fulfillment status (delivery/pickup tracking)
 * @access Private
 */
router.patch(
  '/:id/fulfillment-status',
  orderIdParamValidator,
  updateFulfillmentStatusValidator,

  updateFulfillmentStatusController
);

/**
 * @route POST /api/orders/:id/cancel
 * @desc Cancel an order
 * @access Private
 */
router.post(
  '/:id/cancel',
  orderIdParamValidator,
  cancelOrderValidator,

  cancelOrderController
);

// =============================================================================
// PAYMENT ROUTES
// =============================================================================

/**
 * @route POST /api/orders/:id/pay
 * @desc Mark order as paid
 * @access Private
 */
router.post(
  '/:id/pay',
  orderIdParamValidator,
  markOrderAsPaidValidator,

  markOrderAsPaidController
);

/**
 * @route POST /api/orders/:id/refund
 * @desc Refund an order
 * @access Private
 */
router.post(
  '/:id/refund',
  orderIdParamValidator,
  refundOrderValidator,

  refundOrderController
);

// =============================================================================
// DRIVER ROUTES
// =============================================================================

/**
 * @route POST /api/orders/:id/assign-driver
 * @desc Assign a driver to an order
 * @access Private
 */
router.post(
  '/:id/assign-driver',
  orderIdParamValidator,
  assignDriverValidator,

  assignDriverController
);

/**
 * @route PATCH /api/orders/:id/driver-location
 * @desc Update driver location for an order
 * @access Private
 */
router.patch(
  '/:id/driver-location',
  orderIdParamValidator,
  updateDriverLocationValidator,

  updateDriverLocationController
);

// =============================================================================
// ITEM ROUTES
// =============================================================================

/**
 * @route POST /api/orders/:id/items
 * @desc Add an item to an order
 * @access Private
 */
router.post(
  '/:id/items',
  orderIdParamValidator,
  addItemToOrderValidator,

  addItemToOrderController
);

/**
 * @route DELETE /api/orders/:id/items/:itemId
 * @desc Remove an item from an order
 * @access Private
 */
router.delete(
  '/:id/items/:itemId',
  orderIdParamValidator,
  itemIdParamValidator,

  removeItemFromOrderController
);

/**
 * @route PATCH /api/orders/:id/items/:itemId/quantity
 * @desc Update item quantity in an order
 * @access Private
 */
router.patch(
  '/:id/items/:itemId/quantity',
  orderIdParamValidator,
  itemIdParamValidator,
  updateOrderItemQuantityValidator,

  updateOrderItemQuantityController
);

export default router;
