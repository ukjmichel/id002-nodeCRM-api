/**
 * Item ID Validator
 * Validates business item ID parameter in requests
 */

import { param } from 'express-validator';

export const itemIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),
];
