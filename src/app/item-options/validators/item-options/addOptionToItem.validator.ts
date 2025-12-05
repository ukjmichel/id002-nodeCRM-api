/**
 * Add Option To Item Validator
 * Validates request data for adding a single option group to an item
 */

import { body, param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const addOptionToItemValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .isString()
    .withMessage('Option ID must be a string')
    .matches(OBJECT_ID_REGEX)
    .withMessage('Option ID must be a valid MongoDB ObjectId (24 hex characters)'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  body('isRequired')
    .optional()
    .isBoolean()
    .withMessage('isRequired must be a boolean'),
];
