/**
 * Option ID Validator
 * Validates option ID parameter in requests (MongoDB ObjectId format)
 */

import { param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const optionIdParamValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .matches(OBJECT_ID_REGEX)
    .withMessage('Option ID must be a valid MongoDB ObjectId (24 hex characters)'),
];
