// src/app/auth/validators/login.validator.ts
/**
 * Login Validator
 * Validates request data for user login
 */

import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
];
