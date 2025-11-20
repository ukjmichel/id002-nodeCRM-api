/**
 * Business ID Validator
 * Validates business ID parameter in requests
 */

import { param } from 'express-validator';

export const businessIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),
];
