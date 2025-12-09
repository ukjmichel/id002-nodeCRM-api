/**
 * Order ID Parameter Validator
 * Validates MongoDB ObjectId in route params
 */

import { param } from 'express-validator';

/**
 * Validates the :id parameter is a valid MongoDB ObjectId
 */
export const orderIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Order ID must be a valid MongoDB ObjectId'),
];
