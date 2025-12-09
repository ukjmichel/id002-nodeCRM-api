/**
 * Pagination Query Validator
 * Validates pagination query parameters
 */

import { query } from 'express-validator';

/**
 * Validates pagination query parameters
 */
export const paginationQueryValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer'),

  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
];
