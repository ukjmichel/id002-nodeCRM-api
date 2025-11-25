/**
 * Remove Item Validator
 * Validates request data for removing a single item from an option group
 */

import { param } from 'express-validator';

export const removeItemValidator = [
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
];
