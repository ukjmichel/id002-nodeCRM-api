/**
 * Update Item Option Validator
 * Validates request data for updating an item-option relationship
 */

import { body, param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const updateItemOptionValidator = [
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
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),

  body('isRequired')
    .optional()
    .isBoolean()
    .withMessage('isRequired must be a boolean'),

  // Custom validation to ensure at least one field is provided
  body().custom((value, { req }) => {
    if (req.body.sortOrder === undefined && req.body.isRequired === undefined) {
      throw new Error('At least sortOrder or isRequired must be provided');
    }
    return true;
  }),
];
