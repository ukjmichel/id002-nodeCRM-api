/**
 * Set Active Status Validator
 * Validates request data for setting an item's active status in an option
 */

import { body, param } from 'express-validator';

export const setActiveStatusValidator = [
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

  body('active')
    .notEmpty()
    .withMessage('Active status is required')
    .isBoolean()
    .withMessage('Active must be a boolean'),
];
