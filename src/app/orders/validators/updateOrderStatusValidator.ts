/**
 * Update Order Status Validator
 * Validates request body for updating order status
 */

import { body } from 'express-validator';

/**
 * Valid order statuses
 */
const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
  'refunded',
];

/**
 * Validates the request body for updating order status
 */
export const updateOrderStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),

  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a string')
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),

  body('changedBy')
    .optional()
    .isString()
    .withMessage('ChangedBy must be a string')
    .isLength({ max: 100 })
    .withMessage('ChangedBy cannot exceed 100 characters'),
];
