/**
 * Featured Validator
 * Validates featured update requests
 */

import { body, param } from 'express-validator';

export const setFeaturedValidator = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('featured')
    .notEmpty()
    .withMessage('Featured field is required')
    .isBoolean()
    .withMessage('Featured must be a boolean'),
];
