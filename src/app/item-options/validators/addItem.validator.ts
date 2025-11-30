/**
 * Add Item Validator
 * Validates request data for adding a single item to an option
 */

import { body, param } from 'express-validator';

export const addItemValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('maxQuantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max quantity must be an integer between 1 and 100'),

  body('active').optional().isBoolean().withMessage('Active must be a boolean'),
];
