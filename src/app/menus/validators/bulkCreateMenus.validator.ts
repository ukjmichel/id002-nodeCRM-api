/**
 * Bulk Create Menus Validator
 * Validates request data for bulk creating menus
 */

import { body } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const bulkCreateMenusValidator = [
  body('menus')
    .notEmpty()
    .withMessage('Menus array is required')
    .isArray({ min: 1 })
    .withMessage('Menus must be an array with at least one item'),

  body('menus.*.menuId')
    .notEmpty()
    .withMessage('Menu ID is required for each menu')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  body('menus.*.name')
    .notEmpty()
    .withMessage('Name is required for each menu')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('menus.*.description')
    .notEmpty()
    .withMessage('Description is required for each menu')
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Description must be between 3 and 1000 characters'),

  body('menus.*.items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),

  // Validate each item in the items array (IMenuItem structure)
  body('menus.*.items.*.itemId')
    .optional()
    .isString()
    .withMessage('Each item ID must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each item ID must be a valid UUID'),

  body('menus.*.items.*.quantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be an integer between 1 and 1000'),

  body('menus.*.items.*.activeOptions')
    .optional()
    .isArray()
    .withMessage('Active options must be an array'),

  body('menus.*.items.*.defaultItems')
    .optional()
    .isArray()
    .withMessage('Default items must be an array'),

  body('menus.*.items.*.defaultItems.*')
    .optional()
    .isString()
    .withMessage('Each default item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each default item must be a valid UUID'),
];
