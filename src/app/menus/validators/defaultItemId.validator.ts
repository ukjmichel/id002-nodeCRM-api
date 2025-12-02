/**
 * Default Item ID Parameter Validator
 * Validates the defaultItemId parameter in route paths
 */

import { param } from 'express-validator';

export const defaultItemIdParamValidator = [
  param('defaultItemId')
    .notEmpty()
    .withMessage('Default Item ID is required')
    .isUUID()
    .withMessage('Default Item ID must be a valid UUID'),
];
