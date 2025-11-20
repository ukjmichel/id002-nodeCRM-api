/**
 * SIRET Validator
 * Validates SIRET parameter in requests
 */

import { param } from 'express-validator';

export const siretValidator = [
  param('siret')
    .notEmpty()
    .withMessage('SIRET is required')
    .trim()
    .matches(/^[0-9\s]{14,17}$/)
    .withMessage('SIRET must be 14 digits (spaces allowed)')
    .customSanitizer((value) => value.replace(/\s+/g, ''))
    .isLength({ min: 14, max: 14 })
    .withMessage('SIRET must be exactly 14 digits'),
];
