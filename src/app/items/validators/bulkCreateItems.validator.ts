/**
 * Bulk Create Business Items Validator
 * Validates request data for bulk creating business items
 */

import { body } from 'express-validator';
import {
  VALID_ITEM_TYPES,
  VALID_ITEM_CATEGORIES,
  VALID_SPICY_LEVELS,
  VALID_CURRENCIES,
} from './constants.js';

export const bulkCreateItemsValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be an array with at least one item'),

  body('items.*.businessId')
    .notEmpty()
    .withMessage('Business ID is required for each item')
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),

  body('items.*.name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required for each item')
    .isLength({ min: 2, max: 191 })
    .withMessage('Item name must be between 2 and 191 characters'),

  body('items.*.price')
    .notEmpty()
    .withMessage('Price is required for each item')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('items.*.type')
    .optional()
    .isIn(VALID_ITEM_TYPES)
    .withMessage(`Type must be one of: ${VALID_ITEM_TYPES.join(', ')}`),

  body('items.*.category')
    .optional()
    .isIn(VALID_ITEM_CATEGORIES)
    .withMessage(
      `Category must be one of: ${VALID_ITEM_CATEGORIES.join(', ')}`
    ),

  body('items.*.currency')
    .optional()
    .isIn(VALID_CURRENCIES)
    .withMessage(`Currency must be one of: ${VALID_CURRENCIES.join(', ')}`),

  body('items.*.spicyLevel')
    .optional()
    .isIn(VALID_SPICY_LEVELS)
    .withMessage(
      `Spicy level must be one of: ${VALID_SPICY_LEVELS.join(', ')}`
    ),

  body('items.*.isHalal')
    .optional()
    .isBoolean()
    .withMessage('isHalal must be a boolean'),

  body('items.*.isKosher')
    .optional()
    .isBoolean()
    .withMessage('isKosher must be a boolean'),

  body('items.*.isVegan')
    .optional()
    .isBoolean()
    .withMessage('isVegan must be a boolean'),

  body('items.*.isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean'),

  body('items.*.isGlutenFree')
    .optional()
    .isBoolean()
    .withMessage('isGlutenFree must be a boolean'),

  body('items.*.available')
    .optional()
    .isBoolean()
    .withMessage('available must be a boolean'),

  body('validate')
    .optional()
    .isBoolean()
    .withMessage('validate must be a boolean'),

  body('ignoreDuplicates')
    .optional()
    .isBoolean()
    .withMessage('ignoreDuplicates must be a boolean'),
];
