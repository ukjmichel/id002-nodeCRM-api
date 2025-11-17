// src/app/users/validators/updateUser.validator.ts
/**
 * Update User Validator
 * Validates request data for updating a user
 * Note: verified field is not allowed in updates
 */

import { body, param } from 'express-validator';

export const updateUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be one of: admin, user, moderator'),
];
