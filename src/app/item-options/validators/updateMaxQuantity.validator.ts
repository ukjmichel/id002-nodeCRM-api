/**
 * Update Max Quantity Validator
 * Validates request data for updating an item's max quantity in an option
 */

import { body, param } from 'express-validator';

export const updateMaxQuantityValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('maxQuantity')
    .notEmpty()
    .withMessage('Max quantity is required')
    .isInt({ min: 1, max: 100 })
    .withMessage('Max quantity must be an integer between 1 and 100'),
];
