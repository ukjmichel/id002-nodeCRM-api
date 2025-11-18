// src/app/auth/validators/login.validator.ts
/**
 * Login Validation Schema
 * Validates login request data using express-validator
 * Uses username for login
 */

import { body } from 'express-validator';

/**
 * Login validation rules
 * Validates username and password fields
 */
export const loginValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Username can only contain letters and numbers'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];


