/**
 * Refund Order Validator
 * Validates request body for refunding an order
 */

import { body } from 'express-validator';

/**
 * Validates the request body for refunding an order
 */
export const refundOrderValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Refund amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Refund amount must be greater than 0'),

  body('reason')
    .notEmpty()
    .withMessage('Refund reason is required')
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ min: 3, max: 500 })
    .withMessage('Reason must be between 3 and 500 characters'),

  body('refundedBy')
    .optional()
    .isString()
    .withMessage('RefundedBy must be a string')
    .isLength({ max: 100 })
    .withMessage('RefundedBy cannot exceed 100 characters'),
];
