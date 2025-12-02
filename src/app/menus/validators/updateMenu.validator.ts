/**
 * Update Menu Validator
 * Validates request data for updating a menu
 */

import { body, param } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const updateMenuValidator = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId'),

  body('menuId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Description must be between 3 and 1000 characters'),

  body('items').optional().isArray().withMessage('Items must be an array'),

  // Validate each item in the items array (IMenuItem structure)
  body('items.*.itemId')
    .optional()
    .isString()
    .withMessage('Each item ID must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each item ID must be a valid UUID'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be an integer between 1 and 1000'),

  body('items.*.activeOptions')
    .optional()
    .isArray()
    .withMessage('Active options must be an array'),

  body('items.*.defaultItems')
    .optional()
    .isArray()
    .withMessage('Default items must be an array'),

  body('items.*.defaultItems.*')
    .optional()
    .isString()
    .withMessage('Each default item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each default item must be a valid UUID'),
];
