/**
 * =============================================================================
 * Business Item Validation Utilities
 * =============================================================================
 * Validation and normalization functions for business item data
 * =============================================================================
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ItemType, ItemCategory, SpicyLevel } from '../models/item.model.js';

/**
 * Valid item types
 */
export const VALID_ITEM_TYPES = Object.values(ItemType);

/**
 * Valid item categories
 */
export const VALID_ITEM_CATEGORIES = Object.values(ItemCategory);

/**
 * Valid spicy levels
 */
export const VALID_SPICY_LEVELS = Object.values(SpicyLevel);

/**
 * Valid currencies
 */
export const VALID_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];

/**
 * Validate UUID format
 */
export const validateUuid = (uuid: string, fieldName: string = 'ID'): void => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(uuid)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a valid UUID format`
    );
  }
};

/**
 * Validate item type
 */
export const validateItemType = (type: string): void => {
  if (!VALID_ITEM_TYPES.includes(type as ItemType)) {
    throw new ValidationError(
      'Validation failed',
      `Invalid item type: ${type}. Valid types are: ${VALID_ITEM_TYPES.join(
        ', '
      )}`
    );
  }
};

/**
 * Validate item category
 */
export const validateItemCategory = (category: string): void => {
  if (!VALID_ITEM_CATEGORIES.includes(category as ItemCategory)) {
    throw new ValidationError(
      'Validation failed',
      `Invalid item category: ${category}. Valid categories are: ${VALID_ITEM_CATEGORIES.join(
        ', '
      )}`
    );
  }
};

/**
 * Validate spicy level
 */
export const validateSpicyLevel = (level: string): void => {
  if (!VALID_SPICY_LEVELS.includes(level as SpicyLevel)) {
    throw new ValidationError(
      'Validation failed',
      `Invalid spicy level: ${level}. Valid levels are: ${VALID_SPICY_LEVELS.join(
        ', '
      )}`
    );
  }
};

/**
 * Validate currency code
 */
export const validateCurrency = (currency: string): void => {
  if (!VALID_CURRENCIES.includes(currency)) {
    throw new ValidationError(
      'Validation failed',
      `Invalid currency code: ${currency}. Valid currencies are: ${VALID_CURRENCIES.join(
        ', '
      )}`
    );
  }
};

/**
 * Validate price (positive number)
 */
export const validatePrice = (
  price: number,
  fieldName: string = 'Price'
): void => {
  if (typeof price !== 'number' || isNaN(price)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a number`
    );
  }

  if (price < 0) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a positive number`
    );
  }
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string, fieldName: string = 'URL'): void => {
  try {
    new URL(url);
  } catch {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a valid URL`
    );
  }
};

/**
 * Validate nutritional value (non-negative number)
 */
export const validateNutritionalValue = (
  value: number,
  fieldName: string
): void => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a number`
    );
  }

  if (value < 0) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a non-negative number`
    );
  }
};

/**
 * Validate quantity (positive integer)
 */
export const validateQuantity = (
  quantity: number,
  fieldName: string,
  minValue: number = 0
): void => {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be a number`
    );
  }

  if (!Number.isInteger(quantity)) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be an integer`
    );
  }

  if (quantity < minValue) {
    throw new ValidationError(
      'Validation failed',
      `${fieldName} must be at least ${minValue}`
    );
  }
};

/**
 * Validate discount pricing
 */
export const validateDiscountPricing = (
  price: number,
  discountPrice?: number,
  discountStartDate?: Date,
  discountEndDate?: Date
): void => {
  if (discountPrice !== undefined && discountPrice !== null) {
    validatePrice(discountPrice, 'Discount price');

    if (discountPrice >= price) {
      throw new ValidationError(
        'Validation failed',
        'Discount price must be less than regular price'
      );
    }
  }

  if (discountStartDate && discountEndDate) {
    const startDate = new Date(discountStartDate);
    const endDate = new Date(discountEndDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ValidationError(
        'Validation failed',
        'Invalid discount date format'
      );
    }

    if (startDate > endDate) {
      throw new ValidationError(
        'Validation failed',
        'Discount start date must be before end date'
      );
    }
  }
};

/**
 * Validate order quantities
 */
export const validateOrderQuantities = (
  minOrderQuantity: number,
  maxOrderQuantity?: number
): void => {
  validateQuantity(minOrderQuantity, 'Minimum order quantity', 1);

  if (maxOrderQuantity !== undefined && maxOrderQuantity !== null) {
    validateQuantity(maxOrderQuantity, 'Maximum order quantity', 1);

    if (maxOrderQuantity < minOrderQuantity) {
      throw new ValidationError(
        'Validation failed',
        'Maximum order quantity must be greater than or equal to minimum order quantity'
      );
    }
  }
};

/**
 * Validate dietary consistency
 */
export const validateDietaryConsistency = (data: {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isLactoseFree?: boolean;
  isGlutenFree?: boolean;
  containsMilk?: boolean;
  containsEggs?: boolean;
  containsFish?: boolean;
  containsShellfish?: boolean;
  containsWheat?: boolean;
}): void => {
  // Vegan items cannot contain milk or eggs
  if (data.isVegan) {
    if (data.containsMilk) {
      throw new ValidationError(
        'Validation failed',
        'Vegan items cannot contain milk'
      );
    }
    if (data.containsEggs) {
      throw new ValidationError(
        'Validation failed',
        'Vegan items cannot contain eggs'
      );
    }
  }

  // Vegetarian items cannot contain fish or shellfish
  if (data.isVegetarian) {
    if (data.containsFish) {
      throw new ValidationError(
        'Validation failed',
        'Vegetarian items cannot contain fish'
      );
    }
    if (data.containsShellfish) {
      throw new ValidationError(
        'Validation failed',
        'Vegetarian items cannot contain shellfish'
      );
    }
  }

  // Lactose-free items cannot contain milk
  if (data.isLactoseFree && data.containsMilk) {
    throw new ValidationError(
      'Validation failed',
      'Lactose-free items cannot contain milk'
    );
  }

  // Gluten-free items cannot contain wheat
  if (data.isGlutenFree && data.containsWheat) {
    throw new ValidationError(
      'Validation failed',
      'Gluten-free items cannot contain wheat'
    );
  }
};

/**
 * Normalize item name
 */
export const normalizeName = (name: string): string => {
  return name.trim();
};

/**
 * Normalize SKU (uppercase, no spaces)
 */
export const normalizeSku = (sku: string): string => {
  return sku.trim().toUpperCase();
};

/**
 * Normalize barcode (remove spaces)
 */
export const normalizeBarcode = (barcode: string): string => {
  return barcode.replace(/\s+/g, '');
};

/**
 * Check if a field value has changed
 */
export const shouldValidateField = (
  currentValue: unknown,
  newValue: unknown
): boolean => {
  if (currentValue === newValue) return false;
  if (currentValue == null && newValue == null) return false;
  return true;
};
