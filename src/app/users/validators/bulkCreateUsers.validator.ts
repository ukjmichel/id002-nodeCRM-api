/**
 * Bulk Create Users Validator
 * Validates request data for bulk creating users
 */

import { body } from 'express-validator';

export const bulkCreateUsersValidator = [
  body('users')
    .isArray({ min: 1 })
    .withMessage('Users must be an array with at least one user'),

  body('users.*.username')
    .trim()
    .notEmpty()
    .withMessage('Username is required for each user')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('users.*.email')
    .trim()
    .notEmpty()
    .withMessage('Email is required for each user')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('users.*.password')
    .notEmpty()
    .withMessage('Password is required for each user')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('users.*.firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters'),

  body('users.*.lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters'),

  body('users.*.role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be one of: admin, user, moderator'),
];
