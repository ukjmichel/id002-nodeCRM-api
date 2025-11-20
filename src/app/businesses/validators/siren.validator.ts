/**
 * SIREN Validator
 * Validates SIREN parameter in requests
 */

import { param } from 'express-validator';

export const sirenValidator = [
  param('siren')
    .notEmpty()
    .withMessage('SIREN is required')
    .trim()
    .matches(/^[0-9\s]{9,11}$/)
    .withMessage('SIREN must be 9 digits (spaces allowed)')
    .customSanitizer((value) => value.replace(/\s+/g, ''))
    .isLength({ min: 9, max: 9 })
    .withMessage('SIREN must be exactly 9 digits'),
];
