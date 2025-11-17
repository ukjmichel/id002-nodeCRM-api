// src/app/roles/validators/userId.validator.ts
/**
 * User ID Validator
 * Validates user ID parameter in role requests
 */

import { param } from 'express-validator';

export const userIdValidator = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
];
