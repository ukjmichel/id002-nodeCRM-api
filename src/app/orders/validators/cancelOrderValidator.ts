/**
 * Cancel Order Validator
 * Validates request body for cancelling an order
 */

import { body } from 'express-validator';

/**
 * Validates the request body for cancelling an order
 */
export const cancelOrderValidator = [
  body('reason')
    .notEmpty()
    .withMessage('Cancellation reason is required')
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ min: 3, max: 500 })
    .withMessage('Reason must be between 3 and 500 characters'),

  body('cancelledBy')
    .optional()
    .isString()
    .withMessage('CancelledBy must be a string')
    .isLength({ max: 100 })
    .withMessage('CancelledBy cannot exceed 100 characters'),
];
