/**
 * Bulk Create Business Item Option Groups Validator
 * Validates request data for bulk creating option groups
 */

import { body } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const bulkCreateBusinessItemOptionGroupsValidator = [
  body()
    .isArray({ min: 1 })
    .withMessage('Request body must be an array with at least one item'),

  body('*.optionId')
    .notEmpty()
    .withMessage('Option ID is required for each group')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  body('*.description')
    .notEmpty()
    .withMessage('Description is required for each group')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),

  body('*.items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),

  body('*.items.*')
    .optional()
    .isString()
    .withMessage('Each item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each item must be a valid UUID'),
];
