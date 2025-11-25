/**
 * Create Business Item Option Group Validator
 * Validates request data for creating a new option group
 */

import { body } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createBusinessItemOptionGroupValidator = [
  body('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),

  body('items.*')
    .optional()
    .isString()
    .withMessage('Each item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each item must be a valid UUID'),
];
