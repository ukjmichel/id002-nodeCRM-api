/**
 * SKU Validator
 * Validates SKU parameter in requests
 */

import { param } from 'express-validator';

export const skuValidator = [
  param('sku')
    .notEmpty()
    .withMessage('SKU is required')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU must be between 1 and 50 characters'),
];
