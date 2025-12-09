/**
 * =============================================================================
 * Order Service - Main Export
 * =============================================================================
 * Combines all order service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import { ApiResponse } from '../../../core/interfaces/index.js';
import {
  IOrderDocument,
  CreateOrderInput,
  UpdateOrderInput,
  AddOrderItemInput,
  OrderStatus,
  FulfillmentStatus,
} from '../interfaces/order.interface.js';
import { FilterQuery } from 'mongoose';

// Import all service methods
import { createOrder } from './createOrder.js';
import { findOrderById } from './findOrderById.js';
import { findOrderByOrderId } from './findOrderByOrderId.js';
import { findAllOrders, FindAllOrdersOptions } from './findAllOrders.js';
import { findOrdersByUserId, FindOrdersByUserIdOptions } from './findOrdersByUserId.js';
import { findOrdersByBusinessId, FindOrdersByBusinessIdOptions } from './findOrdersByBusinessId.js';
import { findOrdersByStatus, FindOrdersByStatusOptions } from './findOrdersByStatus.js';
import { findOrdersByFulfillmentStatus, FindOrdersByFulfillmentStatusOptions } from './findOrdersByFulfillmentStatus.js';
import { findPendingOrders, FindPendingOrdersOptions } from './findPendingOrders.js';
import { findActiveOrders, FindActiveOrdersOptions } from './findActiveOrders.js';
import { findOrdersByDriverId, FindOrdersByDriverIdOptions } from './findOrdersByDriverId.js';
import { updateOrder } from './updateOrder.js';
import { updateOrderStatus, UpdateOrderStatusInput } from './updateOrderStatus.js';
import { updateFulfillmentStatus, UpdateFulfillmentStatusInput } from './updateFulfillmentStatus.js';
import { assignDriver, AssignDriverInput } from './assignDriver.js';
import { updateDriverLocation, UpdateDriverLocationInput } from './updateDriverLocation.js';
import { cancelOrder, CancelOrderInput } from './cancelOrder.js';
import { refundOrder, RefundOrderInput } from './refundOrder.js';
import { markOrderAsPaid, MarkOrderAsPaidInput } from './markOrderAsPaid.js';
import { deleteOrder } from './deleteOrder.js';
import { countOrders } from './countOrders.js';
import { getOrderStats, GetOrderStatsOptions, OrderStats } from './getOrderStats.js';
import { addItemToOrder } from './addItemToOrder.js';
import { removeItemFromOrder } from './removeItemFromOrder.js';
import { updateOrderItemQuantity } from './updateOrderItemQuantity.js';

/**
 * Order Service Interface
 */
export interface IOrderService {
  // CRUD Operations
  create(data: CreateOrderInput): Promise<ApiResponse<IOrderDocument>>;
  findById(id: string): Promise<ApiResponse<IOrderDocument>>;
  findByOrderId(orderId: string): Promise<ApiResponse<IOrderDocument>>;
  findAll(options?: FindAllOrdersOptions): Promise<ApiResponse<IOrderDocument[]>>;
  update(id: string, data: UpdateOrderInput): Promise<ApiResponse<IOrderDocument>>;
  delete(id: string): Promise<ApiResponse<void>>;
  count(filter?: FilterQuery<IOrderDocument>): Promise<ApiResponse<number>>;

  // Search Operations
  findByUserId(userId: string, options?: FindOrdersByUserIdOptions): Promise<ApiResponse<IOrderDocument[]>>;
  findByBusinessId(businessId: string, options?: FindOrdersByBusinessIdOptions): Promise<ApiResponse<IOrderDocument[]>>;
  findByStatus(status: OrderStatus, options?: FindOrdersByStatusOptions): Promise<ApiResponse<IOrderDocument[]>>;
  findByFulfillmentStatus(status: FulfillmentStatus, options?: FindOrdersByFulfillmentStatusOptions): Promise<ApiResponse<IOrderDocument[]>>;
  findPending(options?: FindPendingOrdersOptions): Promise<ApiResponse<IOrderDocument[]>>;
  findActive(options?: FindActiveOrdersOptions): Promise<ApiResponse<IOrderDocument[]>>;
  findByDriverId(driverId: string, options?: FindOrdersByDriverIdOptions): Promise<ApiResponse<IOrderDocument[]>>;

  // Status Operations
  updateStatus(id: string, input: UpdateOrderStatusInput): Promise<ApiResponse<IOrderDocument>>;
  updateFulfillmentStatus(id: string, input: UpdateFulfillmentStatusInput): Promise<ApiResponse<IOrderDocument>>;
  cancel(id: string, input: CancelOrderInput): Promise<ApiResponse<IOrderDocument>>;

  // Payment Operations
  markAsPaid(id: string, input?: MarkOrderAsPaidInput): Promise<ApiResponse<IOrderDocument>>;
  refund(id: string, input: RefundOrderInput): Promise<ApiResponse<IOrderDocument>>;

  // Driver Operations
  assignDriver(id: string, input: AssignDriverInput): Promise<ApiResponse<IOrderDocument>>;
  updateDriverLocation(id: string, input: UpdateDriverLocationInput): Promise<ApiResponse<IOrderDocument>>;

  // Item Operations
  addItem(id: string, input: AddOrderItemInput): Promise<ApiResponse<IOrderDocument>>;
  removeItem(id: string, itemId: string): Promise<ApiResponse<IOrderDocument>>;
  updateItemQuantity(id: string, itemId: string, quantity: number): Promise<ApiResponse<IOrderDocument>>;

  // Statistics
  getStats(options?: GetOrderStatsOptions): Promise<ApiResponse<OrderStats>>;
}

/**
 * Order Service
 * Provides all CRUD operations and order-specific business logic
 *
 * @example
 * ```typescript
 * import { OrderService } from './services/order';
 *
 * // Create a new order
 * const newOrder = await OrderService.create({
 *   userId: 'user-uuid',
 *   businessId: 'business-uuid',
 *   items: [{ itemId: 'item-uuid', name: 'Pizza', quantity: 2, unitPrice: 12.99 }],
 *   fulfillmentType: FulfillmentType.DELIVERY,
 *   deliveryAddress: { street: '123 Main St', city: 'Paris', postalCode: '75001', country: 'FR' },
 *   paymentMethod: PaymentMethod.CARD,
 *   customerPhone: '+33612345678',
 *   customerName: 'John Doe'
 * });
 *
 * // Update order status
 * await OrderService.updateStatus('mongo-id', {
 *   status: OrderStatus.CONFIRMED,
 *   note: 'Order confirmed by restaurant'
 * });
 *
 * // Assign driver for delivery
 * await OrderService.assignDriver('mongo-id', {
 *   driverId: 'driver-123',
 *   driverName: 'John Driver',
 *   driverPhone: '+33612345678'
 * });
 *
 * // Get order statistics
 * const stats = await OrderService.getStats({ businessId: 'business-uuid' });
 * ```
 */
export const OrderService: IOrderService = {
  // =========================================================================
  // CRUD Operations
  // =========================================================================
  create: createOrder,
  findById: findOrderById,
  findByOrderId: findOrderByOrderId,
  findAll: findAllOrders,
  update: updateOrder,
  delete: deleteOrder,
  count: countOrders,

  // =========================================================================
  // Search Operations
  // =========================================================================
  findByUserId: findOrdersByUserId,
  findByBusinessId: findOrdersByBusinessId,
  findByStatus: findOrdersByStatus,
  findByFulfillmentStatus: findOrdersByFulfillmentStatus,
  findPending: findPendingOrders,
  findActive: findActiveOrders,
  findByDriverId: findOrdersByDriverId,

  // =========================================================================
  // Status Operations
  // =========================================================================
  updateStatus: updateOrderStatus,
  updateFulfillmentStatus: updateFulfillmentStatus,
  cancel: cancelOrder,

  // =========================================================================
  // Payment Operations
  // =========================================================================
  markAsPaid: markOrderAsPaid,
  refund: refundOrder,

  // =========================================================================
  // Driver Operations
  // =========================================================================
  assignDriver: assignDriver,
  updateDriverLocation: updateDriverLocation,

  // =========================================================================
  // Item Operations
  // =========================================================================
  addItem: addItemToOrder,
  removeItem: removeItemFromOrder,
  updateItemQuantity: updateOrderItemQuantity,

  // =========================================================================
  // Statistics
  // =========================================================================
  getStats: getOrderStats,
};

export default OrderService;

// =========================================================================
// Re-export Individual Methods for Direct Imports
// =========================================================================

export {
  // CRUD
  createOrder,
  findOrderById,
  findOrderByOrderId,
  findAllOrders,
  updateOrder,
  deleteOrder,
  countOrders,

  // Search
  findOrdersByUserId,
  findOrdersByBusinessId,
  findOrdersByStatus,
  findOrdersByFulfillmentStatus,
  findPendingOrders,
  findActiveOrders,
  findOrdersByDriverId,

  // Status
  updateOrderStatus,
  updateFulfillmentStatus,
  cancelOrder,

  // Payment
  markOrderAsPaid,
  refundOrder,

  // Driver
  assignDriver,
  updateDriverLocation,

  // Items
  addItemToOrder,
  removeItemFromOrder,
  updateOrderItemQuantity,

  // Statistics
  getOrderStats,
};

// Re-export types
export type {
  FindAllOrdersOptions,
  FindOrdersByUserIdOptions,
  FindOrdersByBusinessIdOptions,
  FindOrdersByStatusOptions,
  FindOrdersByFulfillmentStatusOptions,
  FindPendingOrdersOptions,
  FindActiveOrdersOptions,
  FindOrdersByDriverIdOptions,
  UpdateOrderStatusInput,
  UpdateFulfillmentStatusInput,
  AssignDriverInput,
  UpdateDriverLocationInput,
  CancelOrderInput,
  RefundOrderInput,
  MarkOrderAsPaidInput,
  GetOrderStatsOptions,
  OrderStats,
};

export type {
  IOrderDocument,
  CreateOrderInput,
  UpdateOrderInput,
  AddOrderItemInput,
} from '../interfaces/order.interface.js';
