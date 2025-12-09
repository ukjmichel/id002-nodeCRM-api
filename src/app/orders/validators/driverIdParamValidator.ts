/**
 * Driver ID Parameter Validator
 * Validates driver ID in route params
 */

import { param } from 'express-validator';

/**
 * Validates the :driverId parameter
 */
export const driverIdParamValidator = [
  param('driverId')
    .notEmpty()
    .withMessage('Driver ID is required')
    .isString()
    .withMessage('Driver ID must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Driver ID must be between 1 and 100 characters'),
];
