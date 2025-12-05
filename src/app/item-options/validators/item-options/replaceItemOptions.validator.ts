/**
 * Replace Item Options Validator
 * Validates request data for replacing all option groups for an item
 */

import { body, param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const replaceItemOptionsValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('options')
    .notEmpty()
    .withMessage('Options array is required')
    .isArray()
    .withMessage('Options must be an array'),

  body('options.*.optionId')
    .notEmpty()
    .withMessage('Option ID is required for each option')
    .isString()
    .withMessage('Option ID must be a string')
    .matches(OBJECT_ID_REGEX)
    .withMessage('Option ID must be a valid MongoDB ObjectId (24 hex characters)'),

  body('options.*.sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  body('options.*.isRequired')
    .optional()
    .isBoolean()
    .withMessage('isRequired must be a boolean'),
];
