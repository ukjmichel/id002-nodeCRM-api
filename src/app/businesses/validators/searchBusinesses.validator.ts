/**
 * Search Businesses Validator
 * Validates request data for searching businesses
 */

import { body } from 'express-validator';

export const searchBusinessesValidator = [
  body('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search query must be between 1 and 200 characters'),

  body('legalForm')
    .optional()
    .isArray()
    .withMessage('Legal form must be an array')
    .custom((value) => {
      const validForms = [
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
      ];
      if (value.some((form: string) => !validForms.includes(form))) {
        throw new Error('Invalid legal form in array');
      }
      return true;
    }),

  body('department')
    .optional()
    .isArray()
    .withMessage('Department must be an array'),

  body('department.*')
    .optional()
    .matches(/^[0-9]{2}[AB]?$/)
    .withMessage('Department code must be 2 digits optionally followed by A or B'),

  body('region')
    .optional()
    .isArray()
    .withMessage('Region must be an array'),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean'),

  body('vatExempt')
    .optional()
    .isBoolean()
    .withMessage('VAT exempt must be a boolean'),

  body('minCapital')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum capital must be a positive number'),

  body('maxCapital')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum capital must be a positive number')
    .custom((value, { req }) => {
      if (req.body.minCapital && value < req.body.minCapital) {
        throw new Error('Maximum capital must be greater than minimum capital');
      }
      return true;
    }),

  body('registeredAfter')
    .optional()
    .isISO8601()
    .withMessage('Registered after date must be a valid date'),

  body('registeredBefore')
    .optional()
    .isISO8601()
    .withMessage('Registered before date must be a valid date')
    .custom((value, { req }) => {
      if (req.body.registeredAfter && new Date(value) < new Date(req.body.registeredAfter)) {
        throw new Error('Registered before date must be after registered after date');
      }
      return true;
    }),

  body('hasRCS')
    .optional()
    .isBoolean()
    .withMessage('Has RCS must be a boolean'),

  body('hasVAT')
    .optional()
    .isBoolean()
    .withMessage('Has VAT must be a boolean'),
];
