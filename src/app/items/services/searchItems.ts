/**
 * Search Business Items Service
 * Advanced search for business items with multiple criteria including dietary filters
 */

import { Op } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemSearchCriteria } from '../interfaces/item.interface.js';
import { ItemModel, SpicyLevel } from '../models/item.model.js';
import { findAllItems } from './findAllItems.js';
import {
  validateUuid,
  validateItemType,
  validateItemCategory,
  validateSpicyLevel,
  validatePrice,
  VALID_ITEM_TYPES,
  VALID_ITEM_CATEGORIES,
  VALID_SPICY_LEVELS,
} from '../utils/validation.js';

/**
 * Get spicy level order for comparison
 */
const getSpicyLevelOrder = (level: SpicyLevel): number => {
  const order: Record<SpicyLevel, number> = {
    [SpicyLevel.NONE]: 0,
    [SpicyLevel.MILD]: 1,
    [SpicyLevel.MEDIUM]: 2,
    [SpicyLevel.HOT]: 3,
    [SpicyLevel.EXTRA_HOT]: 4,
  };
  return order[level];
};

/**
 * Search business items with advanced criteria
 *
 * @param criteria - Search criteria
 * @returns Array of matching business items
 * @throws {ValidationError} When search fails
 *
 * @example
 * ```typescript
 * const results = await searchItems({
 *   query: 'pizza',
 *   isVegetarian: true,
 *   maxPrice: 15,
 *   available: true
 * });
 * ```
 */
export const searchItems = async (
  criteria: ItemSearchCriteria
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    // ========================================================================
    // PRE-DATABASE VALIDATION
    // ========================================================================

    if (!criteria || typeof criteria !== 'object') {
      throw new ValidationError(
        'Validation failed',
        'Search criteria must be an object'
      );
    }

    // Validate query length if provided
    if (criteria.query && criteria.query.length > 200) {
      throw new ValidationError(
        'Validation failed',
        'Search query must not exceed 200 characters'
      );
    }

    // Validate business ID if provided
    if (criteria.businessId) {
      validateUuid(criteria.businessId, 'Business ID');
    }

    // Validate types if provided
    if (criteria.type) {
      if (!Array.isArray(criteria.type)) {
        throw new ValidationError('Validation failed', 'Type must be an array');
      }

      const invalidTypes = criteria.type.filter(
        (t) => !VALID_ITEM_TYPES.includes(t)
      );
      if (invalidTypes.length > 0) {
        throw new ValidationError(
          'Validation failed',
          `Invalid item types: ${invalidTypes.join(', ')}`
        );
      }
    }

    // Validate categories if provided
    if (criteria.category) {
      if (!Array.isArray(criteria.category)) {
        throw new ValidationError(
          'Validation failed',
          'Category must be an array'
        );
      }

      const invalidCategories = criteria.category.filter(
        (c) => !VALID_ITEM_CATEGORIES.includes(c)
      );
      if (invalidCategories.length > 0) {
        throw new ValidationError(
          'Validation failed',
          `Invalid categories: ${invalidCategories.join(', ')}`
        );
      }
    }

    // Validate spicy levels if provided
    if (criteria.spicyLevel) {
      if (!Array.isArray(criteria.spicyLevel)) {
        throw new ValidationError(
          'Validation failed',
          'Spicy level must be an array'
        );
      }

      const invalidLevels = criteria.spicyLevel.filter(
        (l) => !VALID_SPICY_LEVELS.includes(l)
      );
      if (invalidLevels.length > 0) {
        throw new ValidationError(
          'Validation failed',
          `Invalid spicy levels: ${invalidLevels.join(', ')}`
        );
      }
    }

    // Validate max spicy level if provided
    if (criteria.maxSpicyLevel) {
      validateSpicyLevel(criteria.maxSpicyLevel);
    }

    // Validate price range
    if (criteria.minPrice !== undefined && criteria.minPrice < 0) {
      throw new ValidationError(
        'Validation failed',
        'Minimum price must be a positive number'
      );
    }

    if (criteria.maxPrice !== undefined && criteria.maxPrice < 0) {
      throw new ValidationError(
        'Validation failed',
        'Maximum price must be a positive number'
      );
    }

    if (
      criteria.minPrice !== undefined &&
      criteria.maxPrice !== undefined &&
      criteria.minPrice > criteria.maxPrice
    ) {
      throw new ValidationError(
        'Validation failed',
        'Minimum price cannot be greater than maximum price'
      );
    }

    // Validate nutritional filters
    if (criteria.maxCalories !== undefined && criteria.maxCalories < 0) {
      throw new ValidationError(
        'Validation failed',
        'Maximum calories must be a positive number'
      );
    }

    if (criteria.minProtein !== undefined && criteria.minProtein < 0) {
      throw new ValidationError(
        'Validation failed',
        'Minimum protein must be a positive number'
      );
    }

    // ========================================================================
    // DATABASE OPERATION
    // ========================================================================

    const where: any = {};

    // Text search in name, description, shortDescription
    if (criteria.query) {
      const searchTerm = criteria.query.trim();
      where[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
        { shortDescription: { [Op.like]: `%${searchTerm}%` } },
        { sku: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    // Business ID filter
    if (criteria.businessId) {
      where.businessId = criteria.businessId;
    }

    // Type filter
    if (criteria.type && criteria.type.length > 0) {
      where.type = { [Op.in]: criteria.type };
    }

    // Category filter
    if (criteria.category && criteria.category.length > 0) {
      where.category = { [Op.in]: criteria.category };
    }

    // Price range filter
    if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
      where.price = {};
      if (criteria.minPrice !== undefined) {
        where.price[Op.gte] = criteria.minPrice;
      }
      if (criteria.maxPrice !== undefined) {
        where.price[Op.lte] = criteria.maxPrice;
      }
    }

    // Dietary filters
    if (criteria.isHalal !== undefined) {
      where.isHalal = criteria.isHalal;
    }
    if (criteria.isKosher !== undefined) {
      where.isKosher = criteria.isKosher;
    }
    if (criteria.isVegan !== undefined) {
      where.isVegan = criteria.isVegan;
    }
    if (criteria.isVegetarian !== undefined) {
      where.isVegetarian = criteria.isVegetarian;
    }
    if (criteria.isGlutenFree !== undefined) {
      where.isGlutenFree = criteria.isGlutenFree;
    }
    if (criteria.isLactoseFree !== undefined) {
      where.isLactoseFree = criteria.isLactoseFree;
    }
    if (criteria.isOrganic !== undefined) {
      where.isOrganic = criteria.isOrganic;
    }
    if (criteria.isBio !== undefined) {
      where.isBio = criteria.isBio;
    }
    if (criteria.isHomemade !== undefined) {
      where.isHomemade = criteria.isHomemade;
    }

    // Allergen exclusion filters (exclude items that contain these)
    if (criteria.excludeNuts) {
      where.containsNuts = false;
    }
    if (criteria.excludePeanuts) {
      where.containsPeanuts = false;
    }
    if (criteria.excludeSoy) {
      where.containsSoy = false;
    }
    if (criteria.excludeEggs) {
      where.containsEggs = false;
    }
    if (criteria.excludeFish) {
      where.containsFish = false;
    }
    if (criteria.excludeShellfish) {
      where.containsShellfish = false;
    }
    if (criteria.excludeWheat) {
      where.containsWheat = false;
    }
    if (criteria.excludeMilk) {
      where.containsMilk = false;
    }
    if (criteria.excludeSesame) {
      where.containsSesame = false;
    }
    if (criteria.excludeSulfites) {
      where.containsSulfites = false;
    }

    // Spicy level filter
    if (criteria.spicyLevel && criteria.spicyLevel.length > 0) {
      where.spicyLevel = { [Op.in]: criteria.spicyLevel };
    }

    // Max spicy level filter (include all levels up to and including max)
    if (criteria.maxSpicyLevel) {
      const maxOrder = getSpicyLevelOrder(criteria.maxSpicyLevel);
      const allowedLevels = Object.values(SpicyLevel).filter(
        (level) => getSpicyLevelOrder(level) <= maxOrder
      );
      where.spicyLevel = { [Op.in]: allowedLevels };
    }

    // Availability filters
    if (criteria.available !== undefined) {
      where.available = criteria.available;
    }
    if (criteria.availableForDelivery !== undefined) {
      where.availableForDelivery = criteria.availableForDelivery;
    }
    if (criteria.availableForPickup !== undefined) {
      where.availableForPickup = criteria.availableForPickup;
    }
    if (criteria.availableForDineIn !== undefined) {
      where.availableForDineIn = criteria.availableForDineIn;
    }

    // In stock filter
    if (criteria.inStock === true) {
      where[Op.or] = [
        { stockQuantity: null }, // No stock tracking means always in stock
        { stockQuantity: { [Op.gt]: 0 } },
      ];
    } else if (criteria.inStock === false) {
      where.stockQuantity = { [Op.lte]: 0 };
    }

    // Featured filter
    if (criteria.featured !== undefined) {
      where.featured = criteria.featured;
    }

    // Has discount filter (items with active discount)
    if (criteria.hasDiscount === true) {
      const today = new Date();
      where.discountPrice = { [Op.not]: null };
      where[Op.and] = [
        {
          [Op.or]: [
            { discountStartDate: null },
            { discountStartDate: { [Op.lte]: today } },
          ],
        },
        {
          [Op.or]: [
            { discountEndDate: null },
            { discountEndDate: { [Op.gte]: today } },
          ],
        },
      ];
    }

    // Nutritional filters
    if (criteria.maxCalories !== undefined) {
      where.calories = { [Op.lte]: criteria.maxCalories };
    }
    if (criteria.minProtein !== undefined) {
      where.protein = { [Op.gte]: criteria.minProtein };
    }
    if (criteria.maxCarbohydrates !== undefined) {
      where.carbohydrates = { [Op.lte]: criteria.maxCarbohydrates };
    }
    if (criteria.maxFat !== undefined) {
      where.fat = { [Op.lte]: criteria.maxFat };
    }

    // Tags filter
    if (criteria.tags && criteria.tags.length > 0) {
      // For JSON array, use contains operation
      // This depends on the database - for MySQL/MariaDB use JSON_CONTAINS
      // For PostgreSQL use the @> operator
      // Using a simple approach that works across databases
      where[Op.and] = criteria.tags.map((tag) => ({
        tags: { [Op.like]: `%${tag}%` },
      }));
    }

    const result = await findAllItems({
      where,
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      ...result,
      message:
        result.count === 0
          ? 'No items found matching the search criteria'
          : `Found ${result.count} item(s) matching the search criteria`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error searching business items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
