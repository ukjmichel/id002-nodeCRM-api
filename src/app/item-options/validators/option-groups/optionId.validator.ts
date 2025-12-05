/**
 * Option ID Validator
 * Validates option ID parameter in requests
 */

import { param } from 'express-validator';

export const optionIdParamValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),
];
