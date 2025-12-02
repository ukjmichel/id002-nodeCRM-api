/**
 * Update Quantity Validator
 * Validates request data for updating an item's quantity in a menu
 */

import { body, param } from 'express-validator';

export const updateQuantityValidator = [
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

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be an integer between 1 and 1000'),
];
