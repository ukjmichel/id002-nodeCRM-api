/**
 * Has Item Validator
 * Validates request data for checking if an item exists in a menu
 */

import { param } from 'express-validator';

export const hasItemValidator = [
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
