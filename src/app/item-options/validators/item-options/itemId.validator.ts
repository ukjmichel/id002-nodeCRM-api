/**
 * Item ID Validator
 * Validates item ID parameter in requests (UUID format)
 */

import { param } from 'express-validator';

export const itemIdParamValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),
];
