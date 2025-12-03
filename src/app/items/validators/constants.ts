/**
 * Item Validator Constants
 * Shared constants for business item validation
 */

export const VALID_ITEM_TYPES = [
  'food',
  'drink',
  'dessert',
  'appetizer',
  'main_course',
  'side_dish',
  'snack',
  'combo',
  'sauce',
  'supplement',
  'menu',
  'other',
] as const;

export const VALID_ITEM_CATEGORIES = [
  'meat',
  'poultry',
  'seafood',
  'vegetable',
  'dairy',
  'bakery',
  'beverage',
  'frozen',
  'prepared',
  'condiment',
  'other',
] as const;

export const VALID_SPICY_LEVELS = [
  'none',
  'mild',
  'medium',
  'hot',
  'extra_hot',
] as const;

export const VALID_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'] as const;

// Type exports for use in TypeScript
export type ValidItemType = (typeof VALID_ITEM_TYPES)[number];
export type ValidItemCategory = (typeof VALID_ITEM_CATEGORIES)[number];
export type ValidSpicyLevel = (typeof VALID_SPICY_LEVELS)[number];
export type ValidCurrency = (typeof VALID_CURRENCIES)[number];
