/**
 * Validate Password Validator
 * Validates request data for password validation
 */

import { body, param } from 'express-validator';

export const validatePasswordValidator = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
];
