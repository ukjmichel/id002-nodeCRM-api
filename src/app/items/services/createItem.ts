/**
 * Create Business Item Service
 * Creates a new business item record with comprehensive validation and database checks
 */

import type { CreateOptions } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { ItemModel, ItemType, SpicyLevel } from '../models/item.model.js';
import { BusinessModel } from '../../businesses/models/business.model.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemAttributes } from '../interfaces/item.interface.js';
import {
  validateUuid,
  validateItemType,
  validateItemCategory,
  validateSpicyLevel,
  validateCurrency,
  validatePrice,
  validateUrl,
  validateDiscountPricing,
  validateOrderQuantities,
  validateDietaryConsistency,
  validateNutritionalValue,
  validateQuantity,
  normalizeName,
  normalizeSku,
  normalizeBarcode,
} from '../utils/validation.js';

/**
 * Options for create operation
 */
type CreateItemOptions = Pick<CreateOptions<any>, 'transaction'>;

/**
 * Create a new business item
 *
 * @param data - Business item data to create
 * @param options - Create options (transaction support)
 * @returns Created business item record
 * @throws {ValidationError} When validation fails
 *
 * @example
 * ```typescript
 * const newItem = await createItem({
 *   businessId: 'business-uuid',
 *   name: 'Margherita Pizza',
 *   type: 'food',
 *   price: 12.99,
 *   isVegetarian: true
 * });
 * ```
 */
export const createItem = async (
  data: Partial<ItemAttributes>,
  options?: CreateItemOptions
): Promise<ApiResponse<ItemModel>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE REQUIRED FIELDS
    // ========================================================================

    if (!data.businessId) {
      throw new ValidationError('Validation failed', 'Business ID is required');
    }

    if (!data.name) {
      throw new ValidationError('Validation failed', 'Item name is required');
    }

    if (data.price === undefined || data.price === null) {
      throw new ValidationError('Validation failed', 'Price is required');
    }

    // ========================================================================
    // STEP 2: FORMAT VALIDATIONS
    // ========================================================================

    // Validate UUID format
    validateUuid(data.businessId, 'Business ID');

    // Validate item type if provided
    if (data.type) {
      validateItemType(data.type);
    }

    // Validate item category if provided
    if (data.category) {
      validateItemCategory(data.category);
    }

    // Validate spicy level if provided
    if (data.spicyLevel) {
      validateSpicyLevel(data.spicyLevel);
    }

    // Validate currency if provided
    if (data.currency) {
      validateCurrency(data.currency);
    }

    // Validate price
    validatePrice(data.price, 'Price');

    // Validate discount pricing
    if (data.discountPrice !== undefined) {
      validateDiscountPricing(
        data.price,
        data.discountPrice,
        data.discountStartDate,
        data.discountEndDate
      );
    }

    // Validate order quantities
    if (data.minOrderQuantity !== undefined) {
      validateOrderQuantities(data.minOrderQuantity, data.maxOrderQuantity);
    }

    // Validate URLs if provided
    if (data.imageUrl) {
      validateUrl(data.imageUrl, 'Image URL');
    }
    if (data.thumbnailUrl) {
      validateUrl(data.thumbnailUrl, 'Thumbnail URL');
    }

    // Validate nutritional values if provided
    if (data.calories !== undefined) {
      validateNutritionalValue(data.calories, 'Calories');
    }
    if (data.protein !== undefined) {
      validateNutritionalValue(data.protein, 'Protein');
    }
    if (data.carbohydrates !== undefined) {
      validateNutritionalValue(data.carbohydrates, 'Carbohydrates');
    }
    if (data.fat !== undefined) {
      validateNutritionalValue(data.fat, 'Fat');
    }
    if (data.fiber !== undefined) {
      validateNutritionalValue(data.fiber, 'Fiber');
    }
    if (data.sugar !== undefined) {
      validateNutritionalValue(data.sugar, 'Sugar');
    }
    if (data.sodium !== undefined) {
      validateNutritionalValue(data.sodium, 'Sodium');
    }

    // Validate stock quantities if provided
    if (data.stockQuantity !== undefined) {
      validateQuantity(data.stockQuantity, 'Stock quantity', 0);
    }
    if (data.lowStockThreshold !== undefined) {
      validateQuantity(data.lowStockThreshold, 'Low stock threshold', 0);
    }

    // Validate preparation time if provided
    if (data.preparationTime !== undefined) {
      validateQuantity(data.preparationTime, 'Preparation time', 0);
    }

    // Validate dietary consistency
    validateDietaryConsistency({
      isVegan: data.isVegan,
      isVegetarian: data.isVegetarian,
      isLactoseFree: data.isLactoseFree,
      isGlutenFree: data.isGlutenFree,
      containsMilk: data.containsMilk,
      containsEggs: data.containsEggs,
      containsFish: data.containsFish,
      containsShellfish: data.containsShellfish,
      containsWheat: data.containsWheat,
    });

    // ========================================================================
    // STEP 3: DATABASE RELATIONSHIP CHECKS
    // ========================================================================

    // Verify business exists
    const business = await BusinessModel.findByPk(data.businessId, {
      attributes: ['businessId', 'legalName', 'active'],
      transaction: options?.transaction,
    });

    if (!business) {
      throw new ValidationError(
        'Invalid reference',
        `Business with ID ${data.businessId} does not exist`
      );
    }

    // Optionally check if business is active
    if (!business.active) {
      throw new ValidationError(
        'Business inactive',
        'Cannot add items to an inactive business'
      );
    }

    // ========================================================================
    // STEP 4: DATABASE DUPLICATE CHECKS
    // ========================================================================

    // Check for duplicate item name within the same business
    const existingItem = await ItemModel.findOne({
      where: {
        businessId: data.businessId,
        name: normalizeName(data.name),
      },
      attributes: ['itemId', 'name'],
      transaction: options?.transaction,
    });

    if (existingItem) {
      throw new ValidationError(
        'Duplicate item',
        `An item with name '${data.name}' already exists for this business`
      );
    }

    // Check for duplicate SKU if provided
    if (data.sku) {
      const existingSku = await ItemModel.findOne({
        where: { sku: normalizeSku(data.sku) },
        attributes: ['itemId', 'sku', 'name'],
        transaction: options?.transaction,
      });

      if (existingSku) {
        throw new ValidationError(
          'Duplicate SKU',
          `An item with SKU '${data.sku}' already exists (${existingSku.name})`
        );
      }
    }

    // Check for duplicate barcode if provided
    if (data.barcode) {
      const existingBarcode = await ItemModel.findOne({
        where: { barcode: normalizeBarcode(data.barcode) },
        attributes: ['itemId', 'barcode', 'name'],
        transaction: options?.transaction,
      });

      if (existingBarcode) {
        throw new ValidationError(
          'Duplicate barcode',
          `An item with barcode '${data.barcode}' already exists (${existingBarcode.name})`
        );
      }
    }

    // ========================================================================
    // STEP 5: NORMALIZE AND SANITIZE DATA
    // ========================================================================

    const normalizedData: Partial<ItemAttributes> = {
      businessId: data.businessId,
      name: normalizeName(data.name),
      price: data.price,

      // Defaults
      type: data.type || ItemType.OTHER,
      currency: data.currency || 'EUR',
      spicyLevel: data.spicyLevel || SpicyLevel.NONE,

      // Boolean defaults
      isHalal: data.isHalal ?? false,
      isKosher: data.isKosher ?? false,
      isVegan: data.isVegan ?? false,
      isVegetarian: data.isVegan ? true : data.isVegetarian ?? false, // Vegan implies vegetarian
      isGlutenFree: data.isGlutenFree ?? false,
      isLactoseFree: data.isLactoseFree ?? false,
      isOrganic: data.isOrganic ?? false,
      isBio: data.isBio ?? false,
      isHomemade: data.isHomemade ?? false,

      // Allergen defaults
      containsNuts: data.containsNuts ?? false,
      containsPeanuts: data.containsPeanuts ?? false,
      containsSoy: data.containsSoy ?? false,
      containsEggs: data.containsEggs ?? false,
      containsFish: data.containsFish ?? false,
      containsShellfish: data.containsShellfish ?? false,
      containsWheat: data.containsWheat ?? false,
      containsMilk: data.containsMilk ?? false,
      containsSesame: data.containsSesame ?? false,
      containsSulfites: data.containsSulfites ?? false,

      // Preparation defaults
      isRaw: data.isRaw ?? false,
      isCooked: data.isCooked ?? true,
      isFried: data.isFried ?? false,
      isGrilled: data.isGrilled ?? false,
      isSteamed: data.isSteamed ?? false,

      // Availability defaults
      available: data.available ?? true,
      availableForDelivery: data.availableForDelivery ?? true,
      availableForPickup: data.availableForPickup ?? true,
      availableForDineIn: data.availableForDineIn ?? true,

      // Ordering defaults
      minOrderQuantity: data.minOrderQuantity ?? 1,
      sortOrder: data.sortOrder ?? 0,
      featured: data.featured ?? false,
    };

    // Add optional fields only if provided
    if (data.description) normalizedData.description = data.description.trim();
    if (data.shortDescription)
      normalizedData.shortDescription = data.shortDescription.trim();
    if (data.category) normalizedData.category = data.category;
    if (data.discountPrice !== undefined)
      normalizedData.discountPrice = data.discountPrice;
    if (data.discountStartDate)
      normalizedData.discountStartDate = data.discountStartDate;
    if (data.discountEndDate)
      normalizedData.discountEndDate = data.discountEndDate;
    if (data.allergenNotes)
      normalizedData.allergenNotes = data.allergenNotes.trim();
    if (data.servingSize) normalizedData.servingSize = data.servingSize.trim();
    if (data.calories !== undefined) normalizedData.calories = data.calories;
    if (data.protein !== undefined) normalizedData.protein = data.protein;
    if (data.carbohydrates !== undefined)
      normalizedData.carbohydrates = data.carbohydrates;
    if (data.fat !== undefined) normalizedData.fat = data.fat;
    if (data.fiber !== undefined) normalizedData.fiber = data.fiber;
    if (data.sugar !== undefined) normalizedData.sugar = data.sugar;
    if (data.sodium !== undefined) normalizedData.sodium = data.sodium;
    if (data.stockQuantity !== undefined)
      normalizedData.stockQuantity = data.stockQuantity;
    if (data.lowStockThreshold !== undefined)
      normalizedData.lowStockThreshold = data.lowStockThreshold;
    if (data.preparationTime !== undefined)
      normalizedData.preparationTime = data.preparationTime;
    if (data.maxOrderQuantity !== undefined)
      normalizedData.maxOrderQuantity = data.maxOrderQuantity;
    if (data.imageUrl) normalizedData.imageUrl = data.imageUrl.trim();
    if (data.thumbnailUrl)
      normalizedData.thumbnailUrl = data.thumbnailUrl.trim();
    if (data.sku) normalizedData.sku = normalizeSku(data.sku);
    if (data.barcode) normalizedData.barcode = normalizeBarcode(data.barcode);
    if (data.tags) normalizedData.tags = data.tags;

    // ========================================================================
    // STEP 6: DATABASE CREATE OPERATION
    // ========================================================================

    const record = await ItemModel.create(normalizedData as any, {
      transaction: options?.transaction,
    });

    return {
      success: true,
      data: record,
      message: 'Business item created successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    if (error instanceof ValidationError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      throw new ValidationError(
        'Validation failed for Business Item',
        error.message
      );
    }

    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      throw new ValidationError(
        'Duplicate entry',
        'A business item with this value already exists'
      );
    }

    if (
      error instanceof Error &&
      error.name === 'SequelizeForeignKeyConstraintError'
    ) {
      throw new ValidationError(
        'Invalid reference',
        'The specified business ID does not exist'
      );
    }

    if (error instanceof Error && error.name === 'SequelizeConnectionError') {
      throw new ValidationError(
        'Database connection error',
        'Unable to connect to database. Please try again later.'
      );
    }

    if (error instanceof Error && error.name === 'SequelizeTimeoutError') {
      throw new ValidationError(
        'Database timeout',
        'Database operation took too long. Please try again.'
      );
    }

    throw new ValidationError(
      'Error creating Business Item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
