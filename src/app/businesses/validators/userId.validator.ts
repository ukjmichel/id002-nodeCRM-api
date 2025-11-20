/**
 * User ID Validator (for Business routes)
 * Validates user ID parameter in requests
 */

import { param } from 'express-validator';

export const userIdValidator = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
];
