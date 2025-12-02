/**
 * Menu ID Parameter Validator
 * Validates the menuId parameter in route paths
 */

import { param } from 'express-validator';

export const menuIdParamValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),
];
