/**
 * Update Order Item Quantity Validator
 * Validates request body for updating an item's quantity in an order
 */

import { body } from 'express-validator';

/**
 * Validates the request body for updating item quantity
 */
export const updateOrderItemQuantityValidator = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
];
