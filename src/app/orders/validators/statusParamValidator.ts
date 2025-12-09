/**
 * Status Parameter Validator
 * Validates order status in route params
 */

import { param } from 'express-validator';

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
 * Validates the :status parameter is a valid order status
 */
export const statusParamValidator = [
  param('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
];
