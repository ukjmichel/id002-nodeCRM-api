/**
 * Add Item To Order Validator
 * Validates request body for adding an item to an order
 */

import { body } from 'express-validator';

/**
 * Validates the request body for adding an item to an order
 */
export const addItemToOrderValidator = [
  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID(4)
    .withMessage('Item ID must be a valid UUID'),

  body('name')
    .notEmpty()
    .withMessage('Item name is required')
    .isString()
    .withMessage('Item name must be a string')
    .isLength({ min: 1, max: 200 })
    .withMessage('Item name must be between 1 and 200 characters'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),

  body('unitPrice')
    .notEmpty()
    .withMessage('Unit price is required')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),

  body('options')
    .optional()
    .isArray()
    .withMessage('Options must be an array'),

  body('options.*.optionGroupId')
    .optional()
    .isMongoId()
    .withMessage('Option group ID must be a valid MongoDB ObjectId'),

  body('options.*.selectedItems')
    .optional()
    .isArray()
    .withMessage('Selected items must be an array'),

  body('options.*.additionalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Additional price must be a positive number'),

  body('specialInstructions')
    .optional()
    .isString()
    .withMessage('Special instructions must be a string')
    .isLength({ max: 500 })
    .withMessage('Special instructions cannot exceed 500 characters'),
];
