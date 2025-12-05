/**
 * Update Sort Order Validator
 * Validates request data for updating the sort order of an option group
 */

import { body, param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const updateSortOrderValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .matches(OBJECT_ID_REGEX)
    .withMessage('Option ID must be a valid MongoDB ObjectId (24 hex characters)'),

  body('sortOrder')
    .notEmpty()
    .withMessage('Sort order is required')
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
];
