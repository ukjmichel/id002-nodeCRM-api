/**
 * Set Option Required Validator
 * Validates request data for setting the required status of an option group
 */

import { body, param } from 'express-validator';

/**
 * MongoDB ObjectId validation regex (24 hex characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i;

export const setOptionRequiredValidator = [
  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .matches(OBJECT_ID_REGEX)
    .withMessage('Option ID must be a valid MongoDB ObjectId (24 hex characters)'),

  body('isRequired')
    .notEmpty()
    .withMessage('isRequired is required')
    .isBoolean()
    .withMessage('isRequired must be a boolean'),
];
