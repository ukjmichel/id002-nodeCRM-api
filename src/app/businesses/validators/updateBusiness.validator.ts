// src/app/businesses/validators/updateBusiness.validator.ts
/**
 * Update Business Validator
 * Validates request data for updating a business
 * Note: siret, siren, and userId are not allowed in updates
 */

import { body, param } from 'express-validator';

export const updateBusinessValidator = [
  param('id')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),

  body('legalName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 191 })
    .withMessage('Legal name must be between 2 and 191 characters'),

  body('tradeName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 191 })
    .withMessage('Trade name must be between 2 and 191 characters'),

  body('legalForm')
    .optional()
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
    .optional()
    .trim()
    .isLength({ max: 191 })
    .withMessage('Address line 1 must not exceed 191 characters'),

  body('addressLine2')
    .optional()
    .trim()
    .isLength({ max: 191 })
    .withMessage('Address line 2 must not exceed 191 characters'),

  body('postalCode')
    .optional()
    .trim()
    .matches(/^[0-9]{5}$/)
    .withMessage('Postal code must be 5 digits'),

  body('city')
    .optional()
    .trim()
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

  body('closureDate')
    .optional()
    .isISO8601()
    .withMessage('Closure date must be a valid date'),
];
