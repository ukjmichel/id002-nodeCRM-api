/**
 * User ID Parameter Validator
 * Validates UUID in route params
 */

import { param } from 'express-validator';

/**
 * Validates the :userId parameter is a valid UUID
 */
export const userIdParamValidator = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID(4)
    .withMessage('User ID must be a valid UUID'),
];
