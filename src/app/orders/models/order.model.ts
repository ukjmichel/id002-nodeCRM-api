// src/models/order.model.ts
/**
 * =============================================================================
 * OrderModel – Mongoose
 * =============================================================================
 * Stores customer orders including items, pricing, delivery information,
 * payment details, and status tracking.
 * =============================================================================
 */

import { Schema, model } from 'mongoose';
import {
  IOrder,
  IOrderDocument,
  IOrderModel,
  IOrderItem,
  IOrderItemOption,
  IDeliveryAddress,
  IOrderStatusHistory,
  IFulfillmentStatusHistory,
  OrderStatus,
  FulfillmentStatus,
  PaymentStatus,
  PaymentMethod,
  FulfillmentType,
} from '../interfaces/order.interface.js';

// =============================================================================
// Constants
// =============================================================================

/**
 * UUID validation regex
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * MongoDB ObjectId validation regex
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

/**
 * Valid order status transitions (order processing)
 */
const VALID_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
};

/**
 * Valid fulfillment status transitions (for delivery)
 */
const VALID_DELIVERY_FULFILLMENT_TRANSITIONS: Record<
  FulfillmentStatus,
  FulfillmentStatus[]
> = {
  [FulfillmentStatus.PENDING]: [
    FulfillmentStatus.ASSIGNED,
    FulfillmentStatus.FAILED,
  ],
  [FulfillmentStatus.ASSIGNED]: [
    FulfillmentStatus.PICKED_UP,
    FulfillmentStatus.FAILED,
  ],
  [FulfillmentStatus.PICKED_UP]: [
    FulfillmentStatus.IN_TRANSIT,
    FulfillmentStatus.FAILED,
  ],
  [FulfillmentStatus.IN_TRANSIT]: [
    FulfillmentStatus.ARRIVED,
    FulfillmentStatus.FAILED,
  ],
  [FulfillmentStatus.ARRIVED]: [
    FulfillmentStatus.DELIVERED,
    FulfillmentStatus.FAILED,
  ],
  [FulfillmentStatus.DELIVERED]: [],
  [FulfillmentStatus.COLLECTED]: [],
  [FulfillmentStatus.FAILED]: [FulfillmentStatus.PENDING],
};

/**
 * Valid fulfillment status transitions (for pickup)
 */
const VALID_PICKUP_FULFILLMENT_TRANSITIONS: Record<
  FulfillmentStatus,
  FulfillmentStatus[]
> = {
  [FulfillmentStatus.PENDING]: [
    FulfillmentStatus.COLLECTED,
    FulfillmentStatus.FAILED,
  ],
  [FulfillmentStatus.ASSIGNED]: [],
  [FulfillmentStatus.PICKED_UP]: [],
  [FulfillmentStatus.IN_TRANSIT]: [],
  [FulfillmentStatus.ARRIVED]: [],
  [FulfillmentStatus.DELIVERED]: [],
  [FulfillmentStatus.COLLECTED]: [],
  [FulfillmentStatus.FAILED]: [FulfillmentStatus.PENDING],
};

// =============================================================================
// Sub-Schemas
// =============================================================================

/**
 * Schema for order item options
 */
const OrderItemOptionSchema = new Schema<IOrderItemOption>(
  {
    optionGroupId: {
      type: String,
      required: [true, 'Option group ID is required'],
      validate: {
        validator: (v: string): boolean => OBJECT_ID_REGEX.test(v),
        message: 'Option group ID must be a valid MongoDB ObjectId',
      },
    },
    selectedItems: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]): boolean =>
          v.every((id) => UUID_REGEX.test(id)),
        message: 'All selected item IDs must be valid UUIDs',
      },
    },
    additionalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Additional price cannot be negative'],
    },
  },
  { _id: false }
);

/**
 * Schema for order items
 */
const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: {
      type: String,
      required: [true, 'Item ID is required'],
      validate: {
        validator: (v: string): boolean => UUID_REGEX.test(v),
        message: 'Item ID must be a valid UUID',
      },
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [1, 'Item name cannot be empty'],
      maxlength: [200, 'Item name cannot exceed 200 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [100, 'Quantity cannot exceed 100'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    options: {
      type: [OrderItemOptionSchema],
      default: [],
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Special instructions cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

/**
 * Schema for delivery address
 */
const DeliveryAddressSchema = new Schema<IDeliveryAddress>(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      minlength: [2, 'Street address must be at least 2 characters'],
      maxlength: [200, 'Street address cannot exceed 200 characters'],
    },
    street2: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address 2 cannot exceed 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City must be at least 2 characters'],
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      minlength: [2, 'Postal code must be at least 2 characters'],
      maxlength: [20, 'Postal code cannot exceed 20 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      uppercase: true,
      minlength: [2, 'Country code must be 2 characters'],
      maxlength: [2, 'Country code must be 2 characters'],
    },
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Delivery instructions cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

/**
 * Schema for order status history
 */
const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Status note cannot exceed 500 characters'],
    },
    changedBy: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Schema for fulfillment status history
 */
const FulfillmentStatusHistorySchema = new Schema<IFulfillmentStatusHistory>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(FulfillmentStatus),
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Status note cannot exceed 500 characters'],
    },
    driverId: {
      type: String,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
  },
  { _id: false }
);

// =============================================================================
// Main Schema Definition
// =============================================================================

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      index: true,
      trim: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
      validate: {
        validator: (v: string): boolean => UUID_REGEX.test(v),
        message: 'User ID must be a valid UUID',
      },
    },
    businessId: {
      type: String,
      required: [true, 'Business ID is required'],
      index: true,
      validate: {
        validator: (v: string): boolean => UUID_REGEX.test(v),
        message: 'Business ID must be a valid UUID',
      },
    },

    // Order items
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]): boolean => v.length > 0,
        message: 'Order must have at least one item',
      },
    },

    // Pricing
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Tax amount cannot be negative'],
    },
    taxRate: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%'],
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Delivery fee cannot be negative'],
    },
    serviceFee: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Service fee cannot be negative'],
    },
    tipAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Tip amount cannot be negative'],
    },
    discountAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Discount amount cannot be negative'],
    },
    discountCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [50, 'Discount code cannot exceed 50 characters'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    currency: {
      type: String,
      required: true,
      default: 'EUR',
      uppercase: true,
      enum: ['EUR', 'USD', 'GBP', 'CHF'],
    },

    // Fulfillment
    fulfillmentType: {
      type: String,
      required: true,
      enum: Object.values(FulfillmentType),
      index: true,
    },
    deliveryAddress: {
      type: DeliveryAddressSchema,
      required: function (this: IOrderDocument) {
        return this.fulfillmentType === FulfillmentType.DELIVERY;
      },
    },
    scheduledAt: {
      type: Date,
    },
    estimatedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },

    // Status
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    statusHistory: {
      type: [OrderStatusHistorySchema],
      default: [],
    },

    // Fulfillment Status (delivery/pickup tracking)
    fulfillmentStatus: {
      type: String,
      required: true,
      enum: Object.values(FulfillmentStatus),
      default: FulfillmentStatus.PENDING,
      index: true,
    },
    fulfillmentStatusHistory: {
      type: [FulfillmentStatusHistorySchema],
      default: [],
    },
    driverId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    driverName: {
      type: String,
      trim: true,
      maxlength: [100, 'Driver name cannot exceed 100 characters'],
    },
    driverPhone: {
      type: String,
      trim: true,
      maxlength: [20, 'Driver phone cannot exceed 20 characters'],
    },
    driverLocation: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
      updatedAt: {
        type: Date,
      },
    },

    // Payment
    paymentStatus: {
      type: String,
      required: true,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethod),
    },
    paymentTransactionId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    paidAt: {
      type: Date,
    },

    // Contact
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
      minlength: [8, 'Phone number must be at least 8 characters'],
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },

    // Notes
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [1000, 'Special instructions cannot exceed 1000 characters'],
    },
    internalNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Internal notes cannot exceed 1000 characters'],
    },

    // Cancellation/Refund
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters'],
    },
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative'],
    },
    refundReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Refund reason cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

// =============================================================================
// Indexes
// =============================================================================

OrderSchema.index({ orderId: 1 }, { unique: true });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ businessId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ fulfillmentStatus: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ fulfillmentType: 1, status: 1 });
OrderSchema.index({ fulfillmentType: 1, fulfillmentStatus: 1 });
OrderSchema.index({ driverId: 1 }, { sparse: true });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ scheduledAt: 1 }, { sparse: true });

// =============================================================================
// Middleware/Hooks
// =============================================================================

OrderSchema.pre('save', async function (next) {
  try {
    // Generate orderId if not set
    if (this.isNew && !this.orderId) {
      this.orderId = await (this.constructor as IOrderModel).generateOrderId();
    }

    // Add initial order status to history if new
    if (this.isNew && this.statusHistory.length === 0) {
      this.statusHistory.push({
        status: this.status,
        timestamp: new Date(),
        note: 'Order created',
      });
    }

    // Add initial fulfillment status to history if new
    if (this.isNew && this.fulfillmentStatusHistory.length === 0) {
      this.fulfillmentStatusHistory.push({
        status: this.fulfillmentStatus,
        timestamp: new Date(),
        note: 'Awaiting fulfillment',
      });
    }

    // Calculate item total prices
    if (this.isModified('items')) {
      this.items.forEach((item: IOrderItem) => {
        const optionsPrice = item.options.reduce(
          (sum: number, opt: IOrderItemOption) => sum + opt.additionalPrice,
          0
        );
        item.totalPrice = (item.unitPrice + optionsPrice) * item.quantity;
      });
    }

    // Recalculate totals
    if (
      this.isModified('items') ||
      this.isModified('taxRate') ||
      this.isModified('deliveryFee') ||
      this.isModified('serviceFee') ||
      this.isModified('tipAmount') ||
      this.isModified('discountAmount')
    ) {
      this.recalculatePrices();
    }

    // Validate delivery address for delivery orders
    if (
      this.fulfillmentType === FulfillmentType.DELIVERY &&
      !this.deliveryAddress
    ) {
      throw new Error('Delivery address is required for delivery orders');
    }

    // Set delivery fee to 0 for pickup orders
    if (this.fulfillmentType === FulfillmentType.PICKUP) {
      this.deliveryFee = 0;
    }

    // Validate user and business exist
    if (
      this.isNew ||
      this.isModified('userId') ||
      this.isModified('businessId')
    ) {
      const { validateUuid } = await import(
        '../../../core/utils/uuidValidator.js'
      );
      validateUuid(this.userId, 'User ID');
      validateUuid(this.businessId, 'Business ID');

      // Optionally validate user exists
      // const { validateUserExists } = await import('../../users/services/user/index.js');
      // await validateUserExists(this.userId);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// =============================================================================
// Instance Methods
// =============================================================================

OrderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

/**
 * Add an item to the order
 */
OrderSchema.methods.addItem = function (item: IOrderItem): void {
  const existingIndex = this.items.findIndex(
    (i: IOrderItem) => i.itemId === item.itemId
  );

  if (existingIndex === -1) {
    // Calculate total price for new item
    const optionsPrice = item.options.reduce(
      (sum: number, opt: IOrderItemOption) => sum + opt.additionalPrice,
      0
    );
    item.totalPrice = (item.unitPrice + optionsPrice) * item.quantity;
    this.items.push(item);
  }
};

/**
 * Remove an item from the order
 */
OrderSchema.methods.removeItem = function (itemId: string): void {
  this.items = this.items.filter((item: IOrderItem) => item.itemId !== itemId);
};

/**
 * Update item quantity
 */
OrderSchema.methods.updateItemQuantity = function (
  itemId: string,
  quantity: number
): boolean {
  const item = this.items.find((i: IOrderItem) => i.itemId === itemId);
  if (item) {
    item.quantity = quantity;
    const optionsPrice = item.options.reduce(
      (sum: number, opt: IOrderItemOption) => sum + opt.additionalPrice,
      0
    );
    item.totalPrice = (item.unitPrice + optionsPrice) * quantity;
    return true;
  }
  return false;
};

/**
 * Get item by ID
 */
OrderSchema.methods.getItem = function (
  itemId: string
): IOrderItem | undefined {
  return this.items.find((item: IOrderItem) => item.itemId === itemId);
};

/**
 * Get item count
 */
OrderSchema.methods.getItemCount = function (): number {
  return this.items.length;
};

/**
 * Get total item quantity
 */
OrderSchema.methods.getTotalItemQuantity = function (): number {
  return this.items.reduce(
    (total: number, item: IOrderItem) => total + item.quantity,
    0
  );
};

/**
 * Update order status
 */
OrderSchema.methods.updateStatus = function (
  status: OrderStatus,
  note?: string,
  changedBy?: string
): void {
  if (!this.canTransitionTo(status)) {
    throw new Error(
      `Cannot transition order status from ${this.status} to ${status}`
    );
  }

  this.status = status;
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    changedBy,
  });

  // Update completedAt for terminal statuses
  if (status === OrderStatus.COMPLETED || status === OrderStatus.CANCELLED) {
    this.completedAt = new Date();
  }
};

/**
 * Check if order status transition is valid
 */
OrderSchema.methods.canTransitionTo = function (status: OrderStatus): boolean {
  const allowedTransitions =
    VALID_ORDER_STATUS_TRANSITIONS[this.status as OrderStatus];
  return allowedTransitions?.includes(status) ?? false;
};

/**
 * Update fulfillment status
 */
OrderSchema.methods.updateFulfillmentStatus = function (
  status: FulfillmentStatus,
  note?: string,
  driverId?: string,
  location?: { latitude: number; longitude: number }
): void {
  if (!this.canTransitionFulfillmentTo(status)) {
    throw new Error(
      `Cannot transition fulfillment status from ${this.fulfillmentStatus} to ${status}`
    );
  }

  this.fulfillmentStatus = status;
  this.fulfillmentStatusHistory.push({
    status,
    timestamp: new Date(),
    note,
    driverId,
    location,
  });

  // Update completedAt for terminal fulfillment statuses
  if (
    status === FulfillmentStatus.DELIVERED ||
    status === FulfillmentStatus.COLLECTED
  ) {
    this.completedAt = new Date();
    // Also complete the order
    if (this.status === OrderStatus.READY) {
      this.updateStatus(OrderStatus.COMPLETED, 'Order fulfilled');
    }
  }
};

/**
 * Check if fulfillment status transition is valid
 */
OrderSchema.methods.canTransitionFulfillmentTo = function (
  status: FulfillmentStatus
): boolean {
  const transitions =
    this.fulfillmentType === FulfillmentType.DELIVERY
      ? VALID_DELIVERY_FULFILLMENT_TRANSITIONS
      : VALID_PICKUP_FULFILLMENT_TRANSITIONS;

  const allowedTransitions =
    transitions[this.fulfillmentStatus as FulfillmentStatus];
  return allowedTransitions?.includes(status) ?? false;
};

/**
 * Assign driver to order
 */
OrderSchema.methods.assignDriver = function (
  driverId: string,
  driverName: string,
  driverPhone?: string
): void {
  this.driverId = driverId;
  this.driverName = driverName;
  if (driverPhone) {
    this.driverPhone = driverPhone;
  }

  this.updateFulfillmentStatus(
    FulfillmentStatus.ASSIGNED,
    `Driver assigned: ${driverName}`,
    driverId
  );
};

/**
 * Update driver location
 */
OrderSchema.methods.updateDriverLocation = function (
  latitude: number,
  longitude: number
): void {
  this.driverLocation = {
    latitude,
    longitude,
    updatedAt: new Date(),
  };
};

/**
 * Mark order as paid
 */
OrderSchema.methods.markAsPaid = function (transactionId?: string): void {
  this.paymentStatus = PaymentStatus.PAID;
  this.paidAt = new Date();
  if (transactionId) {
    this.paymentTransactionId = transactionId;
  }
};

/**
 * Mark order as refunded
 */
OrderSchema.methods.markAsRefunded = function (
  amount: number,
  reason?: string
): void {
  if (amount >= this.totalAmount) {
    this.paymentStatus = PaymentStatus.REFUNDED;
  } else {
    this.paymentStatus = PaymentStatus.PARTIALLY_REFUNDED;
  }
  this.refundAmount = amount;
  if (reason) {
    this.refundReason = reason;
  }
  this.updateStatus(OrderStatus.REFUNDED, `Refunded: ${amount}`);
};

/**
 * Calculate subtotal from items
 */
OrderSchema.methods.calculateSubtotal = function (): number {
  return this.items.reduce(
    (total: number, item: IOrderItem) => total + item.totalPrice,
    0
  );
};

/**
 * Calculate total amount
 */
OrderSchema.methods.calculateTotal = function (): number {
  const subtotal = this.calculateSubtotal();
  const tax = subtotal * (this.taxRate / 100);
  return (
    subtotal +
    tax +
    this.deliveryFee +
    this.serviceFee +
    this.tipAmount -
    this.discountAmount
  );
};

/**
 * Recalculate all prices
 */
OrderSchema.methods.recalculatePrices = function (): void {
  this.subtotal = this.calculateSubtotal();
  this.taxAmount = this.subtotal * (this.taxRate / 100);
  this.totalAmount =
    this.subtotal +
    this.taxAmount +
    this.deliveryFee +
    this.serviceFee +
    this.tipAmount -
    this.discountAmount;
};

// =============================================================================
// Static Methods
// =============================================================================

/**
 * Find order by orderId
 */
OrderSchema.statics.findByOrderId = function (orderId: string) {
  return this.findOne({ orderId });
};

/**
 * Find orders by userId
 */
OrderSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Find orders by businessId
 */
OrderSchema.statics.findByBusinessId = function (businessId: string) {
  return this.find({ businessId }).sort({ createdAt: -1 });
};

/**
 * Find orders by status
 */
OrderSchema.statics.findByStatus = function (status: OrderStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

/**
 * Find pending orders
 */
OrderSchema.statics.findPendingOrders = function () {
  return this.find({
    status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
  }).sort({ createdAt: 1 });
};

/**
 * Generate unique order ID
 */
OrderSchema.statics.generateOrderId = async function (): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

  // Get count of orders today
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const count = await this.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const sequence = String(count + 1).padStart(5, '0');
  return `ORD-${dateStr}-${sequence}`;
};

// =============================================================================
// Model Export
// =============================================================================

export const OrderModel = model<IOrderDocument, IOrderModel>(
  'Order',
  OrderSchema
);

export type OrderModelType = typeof OrderModel;

// Re-export enums
export {
  OrderStatus,
  FulfillmentStatus,
  PaymentStatus,
  PaymentMethod,
  FulfillmentType,
} from '../interfaces/order.interface.js';
