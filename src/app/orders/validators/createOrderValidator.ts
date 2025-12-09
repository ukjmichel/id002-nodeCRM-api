/**
 * Create Order Validator
 * Validates request body for creating a new order
 */

import { body } from 'express-validator';

/**
 * Valid fulfillment types
 */
const FULFILLMENT_TYPES = ['delivery', 'pickup', 'dine_in'];

/**
 * Valid payment methods
 */
const PAYMENT_METHODS = ['cash', 'card', 'online', 'wallet'];

/**
 * Validates the request body for creating a new order
 */
export const createOrderValidator = [
  // User ID
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID(4)
    .withMessage('User ID must be a valid UUID'),

  // Business ID
  body('businessId')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID(4)
    .withMessage('Business ID must be a valid UUID'),

  // Items
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),

  body('items.*.itemId')
    .notEmpty()
    .withMessage('Item ID is required for each item')
    .isUUID(4)
    .withMessage('Item ID must be a valid UUID'),

  body('items.*.name')
    .notEmpty()
    .withMessage('Item name is required')
    .isString()
    .withMessage('Item name must be a string')
    .isLength({ min: 1, max: 200 })
    .withMessage('Item name must be between 1 and 200 characters'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Item quantity is required')
    .isInt({ min: 1, max: 100 })
    .withMessage('Item quantity must be between 1 and 100'),

  body('items.*.unitPrice')
    .notEmpty()
    .withMessage('Item unit price is required')
    .isFloat({ min: 0 })
    .withMessage('Item unit price must be a positive number'),

  body('items.*.options')
    .optional()
    .isArray()
    .withMessage('Item options must be an array'),

  body('items.*.specialInstructions')
    .optional()
    .isString()
    .withMessage('Item special instructions must be a string')
    .isLength({ max: 500 })
    .withMessage('Item special instructions cannot exceed 500 characters'),

  // Fulfillment type
  body('fulfillmentType')
    .notEmpty()
    .withMessage('Fulfillment type is required')
    .isIn(FULFILLMENT_TYPES)
    .withMessage(`Fulfillment type must be one of: ${FULFILLMENT_TYPES.join(', ')}`),

  // Delivery address (conditional)
  body('deliveryAddress')
    .if(body('fulfillmentType').equals('delivery'))
    .notEmpty()
    .withMessage('Delivery address is required for delivery orders'),

  body('deliveryAddress.street')
    .if(body('fulfillmentType').equals('delivery'))
    .notEmpty()
    .withMessage('Street is required')
    .isString()
    .isLength({ min: 2, max: 200 })
    .withMessage('Street must be between 2 and 200 characters'),

  body('deliveryAddress.street2')
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage('Street2 cannot exceed 200 characters'),

  body('deliveryAddress.city')
    .if(body('fulfillmentType').equals('delivery'))
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  body('deliveryAddress.state')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),

  body('deliveryAddress.postalCode')
    .if(body('fulfillmentType').equals('delivery'))
    .notEmpty()
    .withMessage('Postal code is required')
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Postal code must be between 2 and 20 characters'),

  body('deliveryAddress.country')
    .if(body('fulfillmentType').equals('delivery'))
    .notEmpty()
    .withMessage('Country is required')
    .isString()
    .isLength({ min: 2, max: 2 })
    .withMessage('Country must be a 2-character ISO code'),

  body('deliveryAddress.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('deliveryAddress.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('deliveryAddress.instructions')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Delivery instructions cannot exceed 500 characters'),

  // Scheduled time
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled time must be a valid ISO 8601 date'),

  // Payment method
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`),

  // Customer info
  body('customerPhone')
    .notEmpty()
    .withMessage('Customer phone is required')
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage('Customer phone must be between 8 and 20 characters'),

  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Customer email must be a valid email'),

  // Notes
  body('specialInstructions')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Special instructions cannot exceed 1000 characters'),

  // Discount
  body('discountCode')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage('Discount code cannot exceed 50 characters'),

  // Tip
  body('tipAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tip amount must be a positive number'),
];
