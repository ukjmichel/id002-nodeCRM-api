/**
 * Availability Validator
 * Validates availability update requests
 */

import { body, param } from 'express-validator';

export const setAvailabilityValidator = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('available')
    .notEmpty()
    .withMessage('Available field is required')
    .isBoolean()
    .withMessage('Available must be a boolean'),
];
