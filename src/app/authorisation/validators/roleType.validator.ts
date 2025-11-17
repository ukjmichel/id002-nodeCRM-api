// src/app/roles/validators/roleType.validator.ts
/**
 * Role Type Validator
 * Validates role type parameter in requests
 */

import { param } from 'express-validator';
import { RoleType } from '../models/role.model.js';

export const roleTypeValidator = [
  param('roleType')
    .notEmpty()
    .withMessage('Role type is required')
    .isIn(Object.values(RoleType))
    .withMessage(
      `Role type must be one of: ${Object.values(RoleType).join(', ')}`
    ),
];
