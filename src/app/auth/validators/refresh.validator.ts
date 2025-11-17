// src/app/auth/validators/refresh.validator.ts
/**
 * Refresh Token Validator
 * Validates request data for token refresh
 */

import { body } from 'express-validator';

export const refreshValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a string'),
];
