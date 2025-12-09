/**
 * Mark Order As Paid Validator
 * Validates request body for marking an order as paid
 */

import { body } from 'express-validator';

/**
 * Validates the request body for marking an order as paid
 */
export const markOrderAsPaidValidator = [
  body('transactionId')
    .optional()
    .isString()
    .withMessage('Transaction ID must be a string')
    .isLength({ max: 200 })
    .withMessage('Transaction ID cannot exceed 200 characters'),
];
