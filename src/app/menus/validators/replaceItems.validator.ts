/**
 * Replace Items Validator
 * Validates request data for replacing all items in a menu
 */

import { body, param } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const replaceItemsValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  body('itemIds')
    .notEmpty()
    .withMessage('Item IDs array is required')
    .isArray()
    .withMessage('Item IDs must be an array'),

  body('itemIds.*').isUUID().withMessage('Each item ID must be a valid UUID'),

  body('defaultQuantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Default quantity must be an integer between 1 and 1000'),

  body('defaultActiveOptions')
    .optional()
    .isArray()
    .withMessage('Default active options must be an array'),

  body('defaultActiveOptions.*')
    .optional()
    .isString()
    .withMessage('Each default active option must be a string'),

  body('defaultDefaultItems')
    .optional()
    .isArray()
    .withMessage('Default default items must be an array'),

  body('defaultDefaultItems.*')
    .optional()
    .isString()
    .withMessage('Each default default item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each default default item must be a valid UUID'),
];
