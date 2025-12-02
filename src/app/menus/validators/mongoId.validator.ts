/**
 * MongoDB ID Parameter Validator
 * Validates the MongoDB ObjectId parameter in route paths
 */

import { param } from 'express-validator';

export const mongoIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId'),
];
