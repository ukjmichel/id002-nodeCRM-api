/**
 * Active Option Validator
 * Validates request data for managing active options
 */

import { body, param } from 'express-validator';

export const addActiveOptionValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),
];

export const removeActiveOptionValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  param('optionId')
    .notEmpty()
    .withMessage('Option ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Option ID must be between 1 and 100 characters'),
];

export const getActiveOptionsValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),
];

export const setActiveOptionsValidator = [
  param('menuId')
    .notEmpty()
    .withMessage('Menu ID is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Menu ID must be between 1 and 100 characters'),

  param('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),

  body('optionIds')
    .notEmpty()
    .withMessage('Option IDs array is required')
    .isArray()
    .withMessage('Option IDs must be an array'),

  body('optionIds.*')
    .isString()
    .withMessage('Each option ID must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each option ID must be between 1 and 100 characters'),
];
