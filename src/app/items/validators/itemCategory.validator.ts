/**
 * Item Category Validator
 * Validates item category parameter in requests
 */

import { param } from 'express-validator';
import { VALID_ITEM_CATEGORIES } from './constants.js';

export const itemCategoryValidator = [
  param('category')
    .notEmpty()
    .withMessage('Item category is required')
    .isIn(VALID_ITEM_CATEGORIES)
    .withMessage(
      `Item category must be one of: ${VALID_ITEM_CATEGORIES.join(', ')}`
    ),
];
