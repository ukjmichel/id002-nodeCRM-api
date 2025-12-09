/**
 * Update Order Validator
 * Validates request body for updating an order
 */

import { body } from 'express-validator';

/**
 * Validates the request body for updating an order
 */
export const updateOrderValidator = [
  // Delivery address
  body('deliveryAddress')
    .optional(),

  body('deliveryAddress.street')
    .optional()
    .isString()
    .isLength({ min: 2, max: 200 })
    .withMessage('Street must be between 2 and 200 characters'),

  body('deliveryAddress.street2')
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage('Street2 cannot exceed 200 characters'),

  body('deliveryAddress.city')
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  body('deliveryAddress.state')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),

  body('deliveryAddress.postalCode')
    .optional()
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage('Postal code must be between 2 and 20 characters'),

  body('deliveryAddress.country')
    .optional()
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

  // Estimated time
  body('estimatedAt')
    .optional()
    .isISO8601()
    .withMessage('Estimated time must be a valid ISO 8601 date'),

  // Notes
  body('specialInstructions')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Special instructions cannot exceed 1000 characters'),

  body('internalNotes')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Internal notes cannot exceed 1000 characters'),

  // Tip
  body('tipAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tip amount must be a positive number'),
];
