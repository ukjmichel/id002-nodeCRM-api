/**
 * Bulk Update Items Validator
 * Validates request data for bulk updating items in an option group
 */

import { body, param } from 'express-validator';

/**
 * UUID validation regex (v4 format)
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const bulkUpdateItemsValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

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

  body('updates.*.maxQuantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max quantity must be an integer between 1 and 100'),

  body('updates.*.active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean'),

  // Custom validation to ensure at least maxQuantity or active is provided
  body('updates').custom((updates: any[]) => {
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      if (update.maxQuantity === undefined && update.active === undefined) {
        throw new Error(
          `Update at index ${i}: At least maxQuantity or active must be provided`
        );
      }
    }
    return true;
  }),
];
