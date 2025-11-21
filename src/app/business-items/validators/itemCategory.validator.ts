/**
 * Item Category Validator
 * Validates item category parameter in requests
 */

import { param } from 'express-validator';

const VALID_ITEM_CATEGORIES = [
  'meat',
  'poultry',
  'seafood',
  'vegetable',
  'dairy',
  'bakery',
  'beverage',
  'frozen',
  'prepared',
  'other',
];

export const itemCategoryValidator = [
  param('category')
    .notEmpty()
    .withMessage('Item category is required')
    .isIn(VALID_ITEM_CATEGORIES)
    .withMessage(`Item category must be one of: ${VALID_ITEM_CATEGORIES.join(', ')}`),
];
