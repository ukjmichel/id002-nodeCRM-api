/**
 * Update Fulfillment Status Validator
 * Validates request body for updating fulfillment status
 */

import { body } from 'express-validator';

/**
 * Valid fulfillment statuses
 */
const FULFILLMENT_STATUSES = [
  'pending',
  'assigned',
  'picked_up',
  'in_transit',
  'arrived',
  'delivered',
  'collected',
  'failed',
];

/**
 * Validates the request body for updating fulfillment status
 */
export const updateFulfillmentStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Fulfillment status is required')
    .isIn(FULFILLMENT_STATUSES)
    .withMessage(`Fulfillment status must be one of: ${FULFILLMENT_STATUSES.join(', ')}`),

  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string')
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),

  body('driverId')
    .optional()
    .isString()
    .withMessage('Driver ID must be a string')
    .isLength({ max: 100 })
    .withMessage('Driver ID cannot exceed 100 characters'),

  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object'),

  body('location.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('location.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];
