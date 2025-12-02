/**
 * Query Params Validator
 * Validates query parameters for list and count operations
 */

import { query } from 'express-validator';

export const queryParamsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),

  query('filter')
    .optional()
    .isString()
    .withMessage('Filter must be a string')
    .custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        throw new Error('Filter must be a valid JSON string');
      }
    }),

  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string')
    .custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        throw new Error('Sort must be a valid JSON string');
      }
    }),
];
