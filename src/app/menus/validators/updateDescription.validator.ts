/**
 * Update Description Validator
 * Validates description field in update requests
 */

import { body } from 'express-validator';

export const updateDescriptionValidator = [
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters long')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
];
