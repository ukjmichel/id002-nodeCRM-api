/**
 * Deactivate Business Validator
 * Validates request data for deactivating a business
 */

import { body, param } from 'express-validator';

export const deactivateBusinessValidator = [
  param('id')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),

  body('closureDate')
    .optional()
    .isISO8601()
    .withMessage('Closure date must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) {
        throw new Error('Closure date cannot be in the future');
      }
      return true;
    }),
];
