/**
 * Query Params Validator
 * Validates query parameters for option group list endpoints
 */

import { query } from 'express-validator';

export const queryParamsValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),

  query('where')
    .optional()
    .isJSON()
    .withMessage('Where clause must be valid JSON'),

  query('order')
    .optional()
    .isJSON()
    .withMessage('Order clause must be valid JSON'),
];
