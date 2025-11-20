/**
 * Legal Form Validator
 * Validates legal form parameter in requests
 */

import { param } from 'express-validator';

export const legalFormValidator = [
  param('legalForm')
    .notEmpty()
    .withMessage('Legal form is required')
    .isIn([
      'SARL',
      'EURL',
      'SAS',
      'SASU',
      'SA',
      'SNC',
      'SCS',
      'SCA',
      'EI',
      'EIRL',
      'Auto-entrepreneur',
      'Micro-entreprise',
      'Association',
      'SCI',
      'SCOP',
      'GIE',
      'Other',
    ])
    .withMessage('Invalid legal form'),
];
