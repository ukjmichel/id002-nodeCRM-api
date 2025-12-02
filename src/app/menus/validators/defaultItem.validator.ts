/**
 * Default Item Validator
 * Validates request data for managing default items
 */

import { body, param } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const addDefaultItemValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('defaultItemId')
    .notEmpty()
    .withMessage('Default Item ID is required')
    .isUUID()
    .withMessage('Default Item ID must be a valid UUID'),
];

export const removeDefaultItemValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  param('defaultItemId')
    .notEmpty()
    .withMessage('Default Item ID is required')
    .isUUID()
    .withMessage('Default Item ID must be a valid UUID'),
];

export const getDefaultItemsValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),
];

export const setDefaultItemsValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('defaultItemIds')
    .notEmpty()
    .withMessage('Default Item IDs array is required')
    .isArray()
    .withMessage('Default Item IDs must be an array'),

  body('defaultItemIds.*')
    .isString()
    .withMessage('Each default item ID must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each default item ID must be a valid UUID'),
];
