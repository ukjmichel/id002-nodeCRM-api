// src/app/users/validators/updatePassword.validator.ts
/**
 * Update Password Validator
 * Validates request data for updating a user's password
 */

import { body, param } from 'express-validator';

export const updatePasswordValidator = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'New password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  // Optional: Add current password validation for extra security
  body('currentPassword')
    .optional()
    .isString()
    .withMessage('Current password must be a string'),
];
