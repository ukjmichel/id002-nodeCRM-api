/**
 * Assign Driver Validator
 * Validates request body for assigning a driver to an order
 */

import { body } from 'express-validator';

/**
 * Validates the request body for assigning a driver
 */
export const assignDriverValidator = [
  body('driverId')
    .notEmpty()
    .withMessage('Driver ID is required')
    .isString()
    .withMessage('Driver ID must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Driver ID must be between 1 and 100 characters'),

  body('driverName')
    .notEmpty()
    .withMessage('Driver name is required')
    .isString()
    .withMessage('Driver name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Driver name must be between 2 and 100 characters'),

  body('driverPhone')
    .optional()
    .isString()
    .withMessage('Driver phone must be a string')
    .isLength({ min: 8, max: 20 })
    .withMessage('Driver phone must be between 8 and 20 characters'),
];
