/**
 * Item ID Parameter Validator
 * Validates the itemId parameter in route paths
 */

import { param } from 'express-validator';

export const itemIdParamValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),
];
