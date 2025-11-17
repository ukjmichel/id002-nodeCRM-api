// src/app/roles/validators/createRole.validator.ts
/**
 * Create Role Validator
 * Validates request data for creating a new role
 */

import { body } from 'express-validator';
import { RoleType } from '../models/role.model.js';

export const createRoleValidator = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('roleType')
    .notEmpty()
    .withMessage('Role type is required')
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
