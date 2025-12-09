/**
 * Update Driver Location Validator
 * Validates request body for updating driver location
 */

import { body } from 'express-validator';

/**
 * Validates the request body for updating driver location
 */
export const updateDriverLocationValidator = [
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];
