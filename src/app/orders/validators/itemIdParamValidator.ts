/**
 * Item ID Parameter Validator
 * Validates item UUID in route params
 */

import { param } from 'express-validator';

/**
 * Validates the :itemId parameter is a valid UUID
 */
export const itemIdParamValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID(4)
    .withMessage('Item ID must be a valid UUID'),
];
