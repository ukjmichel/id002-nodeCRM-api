/**
 * Bulk Create Businesses Validator
 * Validates request data for bulk creating businesses
 */

import { body } from 'express-validator';

export const bulkCreateBusinessesValidator = [
  body('businesses')
    .isArray({ min: 1 })
    .withMessage('Businesses must be an array with at least one business'),

  body('businesses.*.userId')
    .notEmpty()
    .withMessage('User ID is required for each business')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),

  body('businesses.*.siret')
    .trim()
    .notEmpty()
    .withMessage('SIRET is required for each business')
    .isLength({ min: 14, max: 14 })
    .withMessage('SIRET must be exactly 14 characters')
    .matches(/^[0-9]{14}$/)
    .withMessage('SIRET must contain only numbers'),

  body('businesses.*.siren')
    .trim()
    .notEmpty()
    .withMessage('SIREN is required for each business')
    .isLength({ min: 9, max: 9 })
    .withMessage('SIREN must be exactly 9 characters')
    .matches(/^[0-9]{9}$/)
    .withMessage('SIREN must contain only numbers'),

  body('businesses.*.legalName')
    .trim()
    .notEmpty()
    .withMessage('Legal name is required for each business')
    .isLength({ min: 2, max: 191 })
    .withMessage('Legal name must be between 2 and 191 characters'),

  body('businesses.*.legalForm')
    .notEmpty()
    .withMessage('Legal form is required for each business')
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

  body('businesses.*.addressLine1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required for each business')
    .isLength({ max: 191 })
    .withMessage('Address line 1 must not exceed 191 characters'),

  body('businesses.*.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required for each business')
    .matches(/^[0-9]{5}$/)
    .withMessage('Postal code must be 5 digits'),

  body('businesses.*.city')
    .trim()
    .notEmpty()
    .withMessage('City is required for each business')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),

  body('businesses.*.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Country code must be 2 characters (ISO 3166-1 alpha-2)'),
];
