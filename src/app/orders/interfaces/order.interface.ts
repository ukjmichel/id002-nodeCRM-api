// src/interfaces/order.interface.ts
/**
 * =============================================================================
 * Order Interface
 * =============================================================================
 * TypeScript interfaces for customer orders
 * =============================================================================
 */

import { Document, Model } from 'mongoose';

// =============================================================================
// Enums
// =============================================================================

/**
 * Order status enum (order processing)
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Fulfillment status enum (delivery/pickup tracking)
 */
export enum FulfillmentStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  ARRIVED = 'arrived',
  DELIVERED = 'delivered',
  COLLECTED = 'collected',
  FAILED = 'failed',
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
  WALLET = 'wallet',
}

/**
 * Fulfillment type enum
 */
export enum FulfillmentType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
}

// =============================================================================
// Sub-interfaces
// =============================================================================

/**
 * Interface for order item options (customizations)
 */
export interface IOrderItemOption {
  /** Option group ID (MongoDB ObjectId as string) */
  optionGroupId: string;
  /** Selected item IDs within the option group */
  selectedItems: string[];
  /** Additional price for this option */
  additionalPrice: number;
}

/**
 * Interface for individual order item
 */
export interface IOrderItem {
  /** Item UUID (reference to SQL Item) */
  itemId: string;
  /** Item name (denormalized for history) */
  name: string;
  /** Quantity ordered */
  quantity: number;
  /** Unit price at time of order */
  unitPrice: number;
  /** Total price for this item (unitPrice * quantity + options) */
  totalPrice: number;
  /** Selected options/customizations */
  options: IOrderItemOption[];
  /** Special instructions for this item */
  specialInstructions?: string;
}

/**
 * Interface for delivery address
 */
export interface IDeliveryAddress {
  /** Street address line 1 */
  street: string;
  /** Street address line 2 (apartment, suite, etc.) */
  street2?: string;
  /** City */
  city: string;
  /** State/Province/Region */
  state?: string;
  /** Postal/ZIP code */
  postalCode: string;
  /** Country code (ISO 3166-1 alpha-2) */
  country: string;
  /** Latitude for delivery location */
  latitude?: number;
  /** Longitude for delivery location */
  longitude?: number;
  /** Delivery instructions */
  instructions?: string;
}

/**
 * Interface for order status history entry
 */
export interface IOrderStatusHistory {
  /** Status value */
  status: OrderStatus;
  /** Timestamp when status was set */
  timestamp: Date;
  /** Optional note about status change */
  note?: string;
  /** User who changed the status (if applicable) */
  changedBy?: string;
}

/**
 * Interface for fulfillment status history entry
 */
export interface IFulfillmentStatusHistory {
  /** Fulfillment status value */
  status: FulfillmentStatus;
  /** Timestamp when status was set */
  timestamp: Date;
  /** Optional note about status change */
  note?: string;
  /** Driver/courier ID (if applicable) */
  driverId?: string;
  /** Location at time of status change */
  location?: {
    latitude: number;
    longitude: number;
  };
}

// =============================================================================
// Main interfaces
// =============================================================================

/**
 * Base interface for Order
 */
export interface IOrder {
  /** Unique order identifier (e.g., ORD-20240101-XXXXX) */
  orderId: string;
  /** User UUID (reference to SQL User) */
  userId: string;
  /** Business UUID (reference to SQL Business) */
  businessId: string;

  // Order items
  /** Array of ordered items */
  items: IOrderItem[];

  // Pricing
  /** Subtotal before tax and fees */
  subtotal: number;
  /** Tax amount */
  taxAmount: number;
  /** Tax rate applied (percentage) */
  taxRate: number;
  /** Delivery fee */
  deliveryFee: number;
  /** Service fee */
  serviceFee: number;
  /** Tip amount */
  tipAmount: number;
  /** Discount amount */
  discountAmount: number;
  /** Discount code used */
  discountCode?: string;
  /** Total amount */
  totalAmount: number;
  /** Currency code (ISO 4217) */
  currency: string;

  // Fulfillment
  /** Fulfillment type (delivery or pickup at stall) */
  fulfillmentType: FulfillmentType;
  /** Delivery address (required for delivery orders) */
  deliveryAddress?: IDeliveryAddress;
  /** Scheduled delivery/pickup time */
  scheduledAt?: Date;
  /** Estimated delivery/ready time */
  estimatedAt?: Date;
  /** Actual completion time */
  completedAt?: Date;

  // Status
  /** Current order status (processing) */
  status: OrderStatus;
  /** Status history */
  statusHistory: IOrderStatusHistory[];

  // Fulfillment Status (delivery/pickup tracking)
  /** Current fulfillment status */
  fulfillmentStatus: FulfillmentStatus;
  /** Fulfillment status history */
  fulfillmentStatusHistory: IFulfillmentStatusHistory[];
  /** Assigned driver/courier ID */
  driverId?: string;
  /** Driver name */
  driverName?: string;
  /** Driver phone */
  driverPhone?: string;
  /** Current driver location */
  driverLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: Date;
  };

  // Payment
  /** Payment status */
  paymentStatus: PaymentStatus;
  /** Payment method */
  paymentMethod: PaymentMethod;
  /** Payment transaction ID */
  paymentTransactionId?: string;
  /** Payment timestamp */
  paidAt?: Date;

  // Contact
  /** Customer phone for this order */
  customerPhone: string;
  /** Customer name for this order */
  customerName: string;
  /** Customer email for this order */
  customerEmail?: string;

  // Notes
  /** Special instructions for the order */
  specialInstructions?: string;
  /** Internal notes (not visible to customer) */
  internalNotes?: string;

  // Cancellation/Refund
  /** Cancellation reason */
  cancellationReason?: string;
  /** Refund amount (if refunded) */
  refundAmount?: number;
  /** Refund reason */
  refundReason?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface with document methods
 */
export interface IOrderDocument extends IOrder, Document {
  // Item methods
  addItem(item: IOrderItem): void;
  removeItem(itemId: string): void;
  updateItemQuantity(itemId: string, quantity: number): boolean;
  getItem(itemId: string): IOrderItem | undefined;
  getItemCount(): number;
  getTotalItemQuantity(): number;

  // Status methods
  updateStatus(status: OrderStatus, note?: string, changedBy?: string): void;
  canTransitionTo(status: OrderStatus): boolean;

  // Fulfillment methods
  updateFulfillmentStatus(
    status: FulfillmentStatus,
    note?: string,
    driverId?: string,
    location?: { latitude: number; longitude: number }
  ): void;
  canTransitionFulfillmentTo(status: FulfillmentStatus): boolean;
  assignDriver(
    driverId: string,
    driverName: string,
    driverPhone?: string
  ): void;
  updateDriverLocation(latitude: number, longitude: number): void;

  // Payment methods
  markAsPaid(transactionId?: string): void;
  markAsRefunded(amount: number, reason?: string): void;

  // Price calculation methods
  calculateSubtotal(): number;
  calculateTotal(): number;
  recalculatePrices(): void;
}

/**
 * Interface for static methods (Model methods)
 */
export interface IOrderModel extends Model<IOrderDocument> {
  findByOrderId(orderId: string): Promise<IOrderDocument | null>;
  findByUserId(userId: string): Promise<IOrderDocument[]>;
  findByBusinessId(businessId: string): Promise<IOrderDocument[]>;
  findByStatus(status: OrderStatus): Promise<IOrderDocument[]>;
  findPendingOrders(): Promise<IOrderDocument[]>;
  generateOrderId(): Promise<string>;
}

// =============================================================================
// Input interfaces
// =============================================================================

/**
 * Input for creating a new order
 */
export interface CreateOrderInput {
  userId: string;
  businessId: string;
  items: Omit<IOrderItem, 'totalPrice'>[];
  fulfillmentType: FulfillmentType;
  /** Required for delivery orders */
  deliveryAddress?: IDeliveryAddress;
  scheduledAt?: Date;
  paymentMethod: PaymentMethod;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  specialInstructions?: string;
  discountCode?: string;
  tipAmount?: number;
}

/**
 * Input for updating an order
 */
export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryAddress?: IDeliveryAddress;
  scheduledAt?: Date;
  estimatedAt?: Date;
  specialInstructions?: string;
  internalNotes?: string;
  tipAmount?: number;
}

/**
 * Input for adding an item to an order
 */
export interface AddOrderItemInput {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  options?: IOrderItemOption[];
  specialInstructions?: string;
}
