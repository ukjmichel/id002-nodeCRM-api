/**
 * Fulfillment Status Parameter Validator
 * Validates fulfillment status in route params
 */

import { param } from 'express-validator';

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
 * Validates the :status parameter is a valid fulfillment status
 */
export const fulfillmentStatusParamValidator = [
  param('status')
    .notEmpty()
    .withMessage('Fulfillment status is required')
    .isIn(FULFILLMENT_STATUSES)
    .withMessage(`Fulfillment status must be one of: ${FULFILLMENT_STATUSES.join(', ')}`),
];
