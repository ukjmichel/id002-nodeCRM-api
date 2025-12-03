/**
 * Item Type Validator
 * Validates item type parameter in requests
 */

import { param } from 'express-validator';
import { VALID_ITEM_TYPES } from './constants.js';

export const itemTypeValidator = [
  param('type')
    .notEmpty()
    .withMessage('Item type is required')
    .isIn(VALID_ITEM_TYPES)
    .withMessage(`Item type must be one of: ${VALID_ITEM_TYPES.join(', ')}`),
];
