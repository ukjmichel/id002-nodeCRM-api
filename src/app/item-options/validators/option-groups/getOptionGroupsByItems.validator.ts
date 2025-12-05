/**
 * Get Option Groups By Items Validator
 * Validates request data for searching option groups by item IDs
 */

import { body } from 'express-validator';

export const getOptionGroupsByItemsValidator = [
  body('itemIds')
    .notEmpty()
    .withMessage('Item IDs array is required')
    .isArray({ min: 1 })
    .withMessage('Item IDs must be an array with at least one item'),

  body('itemIds.*').isUUID().withMessage('Each item ID must be a valid UUID'),
];
