/**
 * Reorder Options Validator
 * Validates request data for reordering all option groups for an item
 */

import { body, param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const reorderOptionsValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('optionIds')
    .notEmpty()
    .withMessage('Option IDs array is required')
    .isArray({ min: 1 })
    .withMessage('Option IDs must be an array with at least one item'),

  body('optionIds.*')
    .isString()
    .withMessage('Each option ID must be a string')
    .matches(OBJECT_ID_REGEX)
    .withMessage('Each option ID must be a valid MongoDB ObjectId (24 hex characters)'),
];
