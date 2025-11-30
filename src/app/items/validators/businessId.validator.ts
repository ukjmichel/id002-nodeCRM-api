/**
 * Business ID Validator (for Business Item routes)
 * Validates business ID parameter in requests
 */

import { param } from 'express-validator';

export const businessIdParamValidator = [
  param('businessId')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),
];
