/**
 * =============================================================================
 * Business Item Interface
 * =============================================================================
 * Type definitions for business item attributes and search criteria
 * =============================================================================
 */

import {
  ItemType,
  ItemCategory,
  SpicyLevel,
} from '../models/business-item.model.js';

export interface BusinessItemAttributes {
  itemId: string;
  businessId: string;

  // Basic Information
  name: string;
  description?: string;
  shortDescription?: string;
  type: ItemType;
  category?: ItemCategory;

  // Pricing
  price: number;
  currency: string;
  discountPrice?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;

  // Dietary Information
  isHalal: boolean;
  isKosher: boolean;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isOrganic: boolean;
  isBio: boolean;
  isHomemade: boolean;

  // Allergen Information
  containsNuts: boolean;
  containsPeanuts: boolean;
  containsSoy: boolean;
  containsEggs: boolean;
  containsFish: boolean;
  containsShellfish: boolean;
  containsWheat: boolean;
  containsMilk: boolean;
  containsSesame: boolean;
  containsSulfites: boolean;
  allergenNotes?: string;

  // Taste & Preparation
  spicyLevel: SpicyLevel;
  isRaw: boolean;
  isCooked: boolean;
  isFried: boolean;
  isGrilled: boolean;
  isSteamed: boolean;

  // Nutritional Information
  servingSize?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;

  // Availability
  available: boolean;
  availableForDelivery: boolean;
  availableForPickup: boolean;
  availableForDineIn: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;

  // Ordering
  preparationTime?: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;

  // Display
  imageUrl?: string;
  thumbnailUrl?: string;
  displayOrder: number;
  featured: boolean;

  // Metadata
  sku?: string;
  barcode?: string;
  tags?: string[];

  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Search criteria for business items
 */
export interface BusinessItemSearchCriteria {
  // Text search
  query?: string;

  // Business filter
  businessId?: string;

  // Type and category filters
  type?: ItemType[];
  category?: ItemCategory[];

  // Price range
  minPrice?: number;
  maxPrice?: number;

  // Dietary filters
  isHalal?: boolean;
  isKosher?: boolean;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isLactoseFree?: boolean;
  isOrganic?: boolean;
  isBio?: boolean;
  isHomemade?: boolean;

  // Allergen exclusion filters (items that DO NOT contain)
  excludeNuts?: boolean;
  excludePeanuts?: boolean;
  excludeSoy?: boolean;
  excludeEggs?: boolean;
  excludeFish?: boolean;
  excludeShellfish?: boolean;
  excludeWheat?: boolean;
  excludeMilk?: boolean;
  excludeSesame?: boolean;
  excludeSulfites?: boolean;

  // Spicy level
  spicyLevel?: SpicyLevel[];
  maxSpicyLevel?: SpicyLevel;

  // Availability filters
  available?: boolean;
  availableForDelivery?: boolean;
  availableForPickup?: boolean;
  availableForDineIn?: boolean;
  inStock?: boolean;

  // Feature filters
  featured?: boolean;
  hasDiscount?: boolean;

  // Nutritional filters
  maxCalories?: number;
  minProtein?: number;
  maxCarbohydrates?: number;
  maxFat?: number;

  // Tags
  tags?: string[];
}
