/**
 * Stock Validator
 * Validates stock management requests
 */

import { body, param } from 'express-validator';

export const updateStockValidator = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

export const incrementStockValidator = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('increment')
    .notEmpty()
    .withMessage('Increment value is required')
    .isInt({ min: 1 })
    .withMessage('Increment must be a positive integer'),
];

export const decrementStockValidator = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('decrement')
    .notEmpty()
    .withMessage('Decrement value is required')
    .isInt({ min: 1 })
    .withMessage('Decrement must be a positive integer'),
];
