/**
 * Order ID String Parameter Validator
 * Validates the custom orderId (e.g., ORD-20240101-00001) in route params
 */

import { param } from 'express-validator';

/**
 * Regex for validating orderId format: ORD-YYYYMMDD-XXXXX
 */
const ORDER_ID_REGEX = /^ORD-\d{8}-\d{5}$/;

/**
 * Validates the :orderId parameter is a valid order ID string
 */
export const orderIdStringParamValidator = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .matches(ORDER_ID_REGEX)
    .withMessage('Order ID must be in format ORD-YYYYMMDD-XXXXX'),
];
