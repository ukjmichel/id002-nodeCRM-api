// src/app/roles/validators/bulkCreateRoles.validator.ts
/**
 * Bulk Create Roles Validator
 * Validates request data for bulk creating roles
 */

import { body } from 'express-validator';
import { RoleType } from '../models/role.model.js';

export const bulkCreateRolesValidator = [
  body('roles')
    .isArray({ min: 1 })
    .withMessage('Roles must be an array with at least one role'),

  body('roles.*.userId')
    .notEmpty()
    .withMessage('User ID is required for each role')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('roles.*.roleType')
    .notEmpty()
    .withMessage('Role type is required for each role')
    .isIn(Object.values(RoleType))
    .withMessage(
      `Role type must be one of: ${Object.values(RoleType).join(', ')}`
    ),

  body('roles.*.isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('roles.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];
