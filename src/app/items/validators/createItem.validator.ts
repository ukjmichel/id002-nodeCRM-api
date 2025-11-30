/**
 * Create Business Item Validator
 * Validates request data for creating a new business item
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

const VALID_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];

export const createItemValidator = [
  // Required fields
  body('businessId')
    .notEmpty()
    .withMessage('Business ID is required')
    .isUUID()
    .withMessage('Business ID must be a valid UUID'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2, max: 191 })
    .withMessage('Item name must be between 2 and 191 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  // Optional basic fields
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must not exceed 5000 characters'),

  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Short description must not exceed 255 characters'),

  body('type')
    .optional()
    .isIn(VALID_ITEM_TYPES)
    .withMessage(`Type must be one of: ${VALID_ITEM_TYPES.join(', ')}`),

  body('category')
    .optional()
    .isIn(VALID_ITEM_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_ITEM_CATEGORIES.join(', ')}`),

  // Pricing
  body('currency')
    .optional()
    .isIn(VALID_CURRENCIES)
    .withMessage(`Currency must be one of: ${VALID_CURRENCIES.join(', ')}`),

  body('discountPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number')
    .custom((value, { req }) => {
      if (value && req.body.price && value >= req.body.price) {
        throw new Error('Discount price must be less than regular price');
      }
      return true;
    }),

  body('discountStartDate')
    .optional()
    .isISO8601()
    .withMessage('Discount start date must be a valid date'),

  body('discountEndDate')
    .optional()
    .isISO8601()
    .withMessage('Discount end date must be a valid date')
    .custom((value, { req }) => {
      if (value && req.body.discountStartDate) {
        if (new Date(value) < new Date(req.body.discountStartDate)) {
          throw new Error('Discount end date must be after start date');
        }
      }
      return true;
    }),

  // Dietary Information
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

  // Allergen Information
  body('containsNuts')
    .optional()
    .isBoolean()
    .withMessage('containsNuts must be a boolean'),

  body('containsPeanuts')
    .optional()
    .isBoolean()
    .withMessage('containsPeanuts must be a boolean'),

  body('containsSoy')
    .optional()
    .isBoolean()
    .withMessage('containsSoy must be a boolean'),

  body('containsEggs')
    .optional()
    .isBoolean()
    .withMessage('containsEggs must be a boolean'),

  body('containsFish')
    .optional()
    .isBoolean()
    .withMessage('containsFish must be a boolean'),

  body('containsShellfish')
    .optional()
    .isBoolean()
    .withMessage('containsShellfish must be a boolean'),

  body('containsWheat')
    .optional()
    .isBoolean()
    .withMessage('containsWheat must be a boolean'),

  body('containsMilk')
    .optional()
    .isBoolean()
    .withMessage('containsMilk must be a boolean'),

  body('containsSesame')
    .optional()
    .isBoolean()
    .withMessage('containsSesame must be a boolean'),

  body('containsSulfites')
    .optional()
    .isBoolean()
    .withMessage('containsSulfites must be a boolean'),

  body('allergenNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Allergen notes must not exceed 1000 characters'),

  // Taste & Preparation
  body('spicyLevel')
    .optional()
    .isIn(VALID_SPICY_LEVELS)
    .withMessage(`Spicy level must be one of: ${VALID_SPICY_LEVELS.join(', ')}`),

  body('isRaw')
    .optional()
    .isBoolean()
    .withMessage('isRaw must be a boolean'),

  body('isCooked')
    .optional()
    .isBoolean()
    .withMessage('isCooked must be a boolean'),

  body('isFried')
    .optional()
    .isBoolean()
    .withMessage('isFried must be a boolean'),

  body('isGrilled')
    .optional()
    .isBoolean()
    .withMessage('isGrilled must be a boolean'),

  body('isSteamed')
    .optional()
    .isBoolean()
    .withMessage('isSteamed must be a boolean'),

  // Nutritional Information
  body('servingSize')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Serving size must not exceed 50 characters'),

  body('calories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Calories must be a positive number'),

  body('protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein must be a positive number'),

  body('carbohydrates')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbohydrates must be a positive number'),

  body('fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fat must be a positive number'),

  body('fiber')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fiber must be a positive number'),

  body('sugar')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Sugar must be a positive number'),

  body('sodium')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Sodium must be a positive number'),

  // Availability
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

  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),

  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),

  // Ordering
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer (minutes)'),

  body('minOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum order quantity must be at least 1'),

  body('maxOrderQuantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum order quantity must be at least 1')
    .custom((value, { req }) => {
      if (value && req.body.minOrderQuantity && value < req.body.minOrderQuantity) {
        throw new Error('Maximum order quantity must be >= minimum order quantity');
      }
      return true;
    }),

  // Display
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),

  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail URL must be a valid URL'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),

  // Metadata
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('SKU must not exceed 50 characters'),

  body('barcode')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Barcode must not exceed 50 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string')
    .isLength({ max: 50 })
    .withMessage('Each tag must not exceed 50 characters'),
];
