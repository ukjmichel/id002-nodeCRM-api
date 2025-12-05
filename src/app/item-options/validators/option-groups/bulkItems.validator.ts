/**
 * Bulk Items Validator
 * Validates request data for adding/removing multiple items to/from an option group
 */

import { body, param } from 'express-validator';

export const bulkItemsValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  body('itemIds')
    .notEmpty()
    .withMessage('Item IDs array is required')
    .isArray({ min: 1 })
    .withMessage('Item IDs must be an array with at least one item'),

  body('itemIds.*')
    .isUUID()
    .withMessage('Each item ID must be a valid UUID'),
];
