/**
 * Replace Items Validator
 * Validates request data for replacing all items in an option group
 */

import { body, param } from 'express-validator';

export const replaceItemsValidator = [
  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),

  body('itemIds')
    .notEmpty()
    .withMessage('Item IDs array is required')
    .isArray()
    .withMessage('Item IDs must be an array'),

  body('itemIds.*')
    .optional()
    .isUUID()
    .withMessage('Each item ID must be a valid UUID'),
];
