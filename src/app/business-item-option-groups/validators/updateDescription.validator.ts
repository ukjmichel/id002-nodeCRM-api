/**
 * Update Description Validator
 * Validates request data for updating an option group's description
 */

import { body, param } from 'express-validator';

export const updateDescriptionValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),
];
