// src/app/roles/validators/updateRole.validator.ts
/**
 * Update Role Validator
 * Validates request data for updating a role
 */

import { body, param } from 'express-validator';
import { RoleType } from '../models/role.model.js';

export const updateRoleValidator = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('roleType')
    .optional()
    .isIn(Object.values(RoleType))
    .withMessage(
      `Role type must be one of: ${Object.values(RoleType).join(', ')}`
    ),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];
