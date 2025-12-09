/**
 * Business ID Parameter Validator
 * Validates UUID in route params
 */

import { param } from 'express-validator';

/**
 * Validates the :businessId parameter is a valid UUID
 */
export const businessIdParamValidator = [
  param('businessId')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID(4)
    .withMessage('Business ID must be a valid UUID'),
];
