/**
 * Add Item Validator
 * Validates request data for adding a single item to a menu
 */

import { body, param } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const addItemValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('quantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be an integer between 1 and 1000'),

  body('activeOptions')
    .optional()
    .isArray()
    .withMessage('Active options must be an array'),

  body('activeOptions.*')
    .optional()
    .isString()
    .withMessage('Each active option must be a string'),

  body('defaultItems')
    .optional()
    .isArray()
    .withMessage('Default items must be an array'),

  body('defaultItems.*')
    .optional()
    .isString()
    .withMessage('Each default item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each default item must be a valid UUID'),
];
