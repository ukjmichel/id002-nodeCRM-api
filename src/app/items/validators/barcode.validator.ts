/**
 * Barcode Validator
 * Validates barcode parameter in requests
 */

import { param } from 'express-validator';

export const barcodeValidator = [
  param('barcode')
    .notEmpty()
    .withMessage('Barcode is required')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Barcode must be between 1 and 50 characters'),
];
