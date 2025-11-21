/**
 * Search Business Items Validator
 * Validates request data for searching business items
 */

import { body } from 'express-validator';

const VALID_ITEM_TYPES = [
  'food',
  'drink',
  'dessert',
  'appetizer',
  'main_course',
  'side_dish',
  'snack',
  'combo',
  'other',
];

const VALID_ITEM_CATEGORIES = [
  'meat',
  'poultry',
  'seafood',
  'vegetable',
  'dairy',
  'bakery',
  'beverage',
  'frozen',
  'prepared',
  'other',
];

const VALID_SPICY_LEVELS = ['none', 'mild', 'medium', 'hot', 'extra_hot'];

export const searchBusinessItemsValidator = [
  // Text search
  body('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search query must be between 1 and 200 characters'),

  // Business filter
  body('businessId')
    .optional()
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),

  // Type and category filters
  body('type')
    .optional()
    .isArray()
    .withMessage('Type must be an array')
    .custom((value) => {
      if (value.some((t: string) => !VALID_ITEM_TYPES.includes(t))) {
        throw new Error('Invalid item type in array');
      }
      return true;
    }),

  body('category')
    .optional()
    .isArray()
    .withMessage('Category must be an array')
    .custom((value) => {
      if (value.some((c: string) => !VALID_ITEM_CATEGORIES.includes(c))) {
        throw new Error('Invalid category in array');
      }
      return true;
    }),

  // Price range
  body('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  body('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .custom((value, { req }) => {
      if (req.body.minPrice && value < req.body.minPrice) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),

  // Dietary filters
  body('isHalal')
    .optional()
    .isBoolean()
    .withMessage('isHalal must be a boolean'),

  body('isKosher')
    .optional()
    .isBoolean()
    .withMessage('isKosher must be a boolean'),

  body('isVegan')
    .optional()
    .isBoolean()
    .withMessage('isVegan must be a boolean'),

  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean'),

  body('isGlutenFree')
    .optional()
    .isBoolean()
    .withMessage('isGlutenFree must be a boolean'),

  body('isLactoseFree')
    .optional()
    .isBoolean()
    .withMessage('isLactoseFree must be a boolean'),

  body('isOrganic')
    .optional()
    .isBoolean()
    .withMessage('isOrganic must be a boolean'),

  body('isBio')
    .optional()
    .isBoolean()
    .withMessage('isBio must be a boolean'),

  body('isHomemade')
    .optional()
    .isBoolean()
    .withMessage('isHomemade must be a boolean'),

  // Allergen exclusion filters
  body('excludeNuts')
    .optional()
    .isBoolean()
    .withMessage('excludeNuts must be a boolean'),

  body('excludePeanuts')
    .optional()
    .isBoolean()
    .withMessage('excludePeanuts must be a boolean'),

  body('excludeSoy')
    .optional()
    .isBoolean()
    .withMessage('excludeSoy must be a boolean'),

  body('excludeEggs')
    .optional()
    .isBoolean()
    .withMessage('excludeEggs must be a boolean'),

  body('excludeFish')
    .optional()
    .isBoolean()
    .withMessage('excludeFish must be a boolean'),

  body('excludeShellfish')
    .optional()
    .isBoolean()
    .withMessage('excludeShellfish must be a boolean'),

  body('excludeWheat')
    .optional()
    .isBoolean()
    .withMessage('excludeWheat must be a boolean'),

  body('excludeMilk')
    .optional()
    .isBoolean()
    .withMessage('excludeMilk must be a boolean'),

  body('excludeSesame')
    .optional()
    .isBoolean()
    .withMessage('excludeSesame must be a boolean'),

  body('excludeSulfites')
    .optional()
    .isBoolean()
    .withMessage('excludeSulfites must be a boolean'),

  // Spicy level filters
  body('spicyLevel')
    .optional()
    .isArray()
    .withMessage('Spicy level must be an array')
    .custom((value) => {
      if (value.some((l: string) => !VALID_SPICY_LEVELS.includes(l))) {
        throw new Error('Invalid spicy level in array');
      }
      return true;
    }),

  body('maxSpicyLevel')
    .optional()
    .isIn(VALID_SPICY_LEVELS)
    .withMessage(`Max spicy level must be one of: ${VALID_SPICY_LEVELS.join(', ')}`),

  // Availability filters
  body('available')
    .optional()
    .isBoolean()
    .withMessage('available must be a boolean'),

  body('availableForDelivery')
    .optional()
    .isBoolean()
    .withMessage('availableForDelivery must be a boolean'),

  body('availableForPickup')
    .optional()
    .isBoolean()
    .withMessage('availableForPickup must be a boolean'),

  body('availableForDineIn')
    .optional()
    .isBoolean()
    .withMessage('availableForDineIn must be a boolean'),

  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean'),

  // Feature filters
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),

  body('hasDiscount')
    .optional()
    .isBoolean()
    .withMessage('hasDiscount must be a boolean'),

  // Nutritional filters
  body('maxCalories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max calories must be a positive number'),

  body('minProtein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min protein must be a positive number'),

  body('maxCarbohydrates')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max carbohydrates must be a positive number'),

  body('maxFat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max fat must be a positive number'),

  // Tags
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string'),
];
