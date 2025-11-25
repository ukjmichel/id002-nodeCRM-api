/**
 * MongoDB ID Validator
 * Validates MongoDB ObjectId parameter in requests
 */

import { param } from 'express-validator';

export const mongoIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId'),
];
