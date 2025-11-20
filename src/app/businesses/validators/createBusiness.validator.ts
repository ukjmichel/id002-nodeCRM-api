/**
 * Create Business Validator
 * Validates request data for creating a new business
 */

import { body } from 'express-validator';

export const createBusinessValidator = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('siret')
    .trim()
    .notEmpty()
    .withMessage('SIRET is required')
    .isLength({ min: 14, max: 14 })
    .withMessage('SIRET must be exactly 14 characters')
    .matches(/^[0-9]{14}$/)
    .withMessage('SIRET must contain only numbers'),

  body('siren')
    .trim()
    .notEmpty()
    .withMessage('SIREN is required')
    .isLength({ min: 9, max: 9 })
    .withMessage('SIREN must be exactly 9 characters')
    .matches(/^[0-9]{9}$/)
    .withMessage('SIREN must contain only numbers')
    .custom((siren, { req }) => {
      const siret = req.body.siret?.replace(/\s+/g, '');
      if (siret && siret.substring(0, 9) !== siren) {
        throw new Error('SIREN must match the first 9 digits of SIRET');
      }
      return true;
    }),

  body('legalName')
    .trim()
    .notEmpty()
    .withMessage('Legal name is required')
    .isLength({ min: 2, max: 191 })
    .withMessage('Legal name must be between 2 and 191 characters'),

  body('tradeName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 191 })
    .withMessage('Trade name must be between 2 and 191 characters'),

  body('legalForm')
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

  body('nafCode')
    .optional()
    .trim()
    .matches(/^[0-9]{2}\.[0-9]{2}[A-Z]?$/)
    .withMessage('NAF code must be in format XX.XXX (e.g., 62.01Z)'),

  body('activityDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Activity description must not exceed 500 characters'),

  body('rcsNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('RCS number must not exceed 50 characters'),

  body('rcsCity')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('RCS city must not exceed 100 characters'),

  body('registrationDate')
    .optional()
    .isISO8601()
    .withMessage('Registration date must be a valid date'),

  body('capital')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Capital must be a positive number'),

  body('capitalCurrency')
    .optional()
    .isIn(['EUR', 'USD', 'GBP', 'CHF'])
    .withMessage('Capital currency must be EUR, USD, GBP, or CHF'),

  body('addressLine1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required')
    .isLength({ max: 191 })
    .withMessage('Address line 1 must not exceed 191 characters'),

  body('addressLine2')
    .optional()
    .trim()
    .isLength({ max: 191 })
    .withMessage('Address line 2 must not exceed 191 characters'),

  body('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .matches(/^[0-9]{5}$/)
    .withMessage('Postal code must be 5 digits'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),

  body('department')
    .optional()
    .trim()
    .matches(/^[0-9]{2}[AB]?$/)
    .withMessage('Department code must be 2 digits optionally followed by A or B'),

  body('region')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Region must not exceed 100 characters'),

  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Country code must be 2 characters (ISO 3166-1 alpha-2)'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[0-9\s().-]{10,20}$/)
    .withMessage('Invalid phone number format'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Must be a valid URL'),

  body('vatNumber')
    .optional()
    .trim()
    .matches(/^FR[0-9A-Z]{2}[0-9]{9}$/)
    .withMessage('VAT number must be in format FRXX123456789'),

  body('vatExempt')
    .optional()
    .isBoolean()
    .withMessage('VAT exempt must be a boolean'),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean'),
];
