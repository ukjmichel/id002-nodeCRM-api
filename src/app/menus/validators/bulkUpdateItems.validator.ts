/**
 * Bulk Update Items Validator
 * Validates request data for bulk updating items in a menu
 */

import { body, param } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const bulkUpdateItemsValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  body('updates')
    .notEmpty()
    .withMessage('Updates array is required')
    .isArray({ min: 1 })
    .withMessage('Updates must be an array with at least one item'),

  body('updates.*.itemId')
    .notEmpty()
    .withMessage('Item ID is required for each update')
    .isString()
    .withMessage('Item ID must be a string')
    .matches(UUID_REGEX)
    .withMessage('Item ID must be a valid UUID'),

  body('updates.*.quantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be an integer between 1 and 1000'),

  body('updates.*.activeOptions')
    .optional()
    .isArray()
    .withMessage('Active options must be an array'),

  body('updates.*.activeOptions.*')
    .optional()
    .isString()
    .withMessage('Each active option must be a string'),

  body('updates.*.defaultItems')
    .optional()
    .isArray()
    .withMessage('Default items must be an array'),

  body('updates.*.defaultItems.*')
    .optional()
    .isString()
    .withMessage('Each default item must be a string')
    .matches(UUID_REGEX)
    .withMessage('Each default item must be a valid UUID'),

  // Custom validation to ensure at least one field is provided
  body('updates').custom((updates: any[]) => {
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      if (
        update.quantity === undefined &&
        update.activeOptions === undefined &&
        update.defaultItems === undefined
      ) {
        throw new Error(
          `Update at index ${i}: At least quantity, activeOptions, or defaultItems must be provided`
        );
      }
    }
    return true;
  }),
];
