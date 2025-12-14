/**
 * Bulk Create Business Items Service
 * Creates multiple business item records at once with comprehensive validation
 */

import type { BulkCreateOptions } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemAttributes } from '../interfaces/item.interface.js';
import {
  ItemModel,
  ItemType,
  SpicyLevel,
} from '../models/item.model.js';
import { BusinessModel } from '../../businesses/models/business.model.js';
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
  normalizeName,
  normalizeSku,
  normalizeBarcode,
} from '../utils/validation.js';

/**
 * Options for bulk create operation
 */
type BulkCreateItemOptions = {
  transaction?: BulkCreateOptions<any>['transaction'];
  validate?: boolean;
  ignoreDuplicates?: boolean;
  updateOnDuplicate?: (keyof ItemAttributes)[];
};

/**
 * Validate a single business item record
 */
const validateItemRecord = (
  data: Partial<ItemAttributes>,
  index: number
): void => {
  const prefix = `Item at index ${index}:`;

  // Validate required fields
  if (!data.businessId) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Business ID is required`
    );
  }

  if (!data.name) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Item name is required`
    );
  }

  if (data.price === undefined || data.price === null) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} Price is required`
    );
  }

  // Format validations
  try {
    validateUuid(data.businessId, 'Business ID');
  } catch (error) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (data.type) {
    try {
      validateItemType(data.type);
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (data.category) {
    try {
      validateItemCategory(data.category);
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (data.spicyLevel) {
    try {
      validateSpicyLevel(data.spicyLevel);
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (data.currency) {
    try {
      validateCurrency(data.currency);
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  try {
    validatePrice(data.price, 'Price');
  } catch (error) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (data.discountPrice !== undefined) {
    try {
      validateDiscountPricing(
        data.price,
        data.discountPrice,
        data.discountStartDate,
        data.discountEndDate
      );
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (data.minOrderQuantity !== undefined) {
    try {
      validateOrderQuantities(data.minOrderQuantity, data.maxOrderQuantity);
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (data.imageUrl) {
    try {
      validateUrl(data.imageUrl, 'Image URL');
    } catch (error) {
      throw new ValidationError(
        'Validation failed',
        `${prefix} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  try {
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
  } catch (error) {
    throw new ValidationError(
      'Validation failed',
      `${prefix} ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

/**
 * Bulk create business items
 *
 * @param dataArray - Array of business item data to create
 * @param options - Sequelize bulk create options (transaction support)
 * @returns Created business item records
 * @throws {ValidationError} When bulk creation fails
 *
 * @example
 * ```typescript
 * const items = await bulkCreateItems([
 *   { businessId: 'uuid', name: 'Pizza', price: 12.99, type: 'food' },
 *   { businessId: 'uuid', name: 'Soda', price: 2.99, type: 'drink' },
 * ]);
 * ```
 */
export const bulkCreateItems = async (
  dataArray: Partial<ItemAttributes>[],
  options?: BulkCreateItemOptions
): Promise<ApiResponse<ItemModel[]>> => {
  try {
    // ========================================================================
    // STEP 1: VALIDATE INPUT ARRAY
    // ========================================================================

    if (!Array.isArray(dataArray)) {
      throw new ValidationError(
        'Validation failed',
        'Input must be an array of business items'
      );
    }

    if (dataArray.length === 0) {
      throw new ValidationError(
        'Validation failed',
        'At least one business item is required'
      );
    }

    // ========================================================================
    // STEP 2: VALIDATE EACH RECORD
    // ========================================================================

    dataArray.forEach((data, index) => {
      validateItemRecord(data, index);
    });

    // ========================================================================
    // STEP 3: CHECK FOR DUPLICATES WITHIN ARRAY
    // ========================================================================

    // Check for duplicate names within same business
    const businessNamePairs = dataArray.map(
      (d) => `${d.businessId}:${normalizeName(d.name!)}`
    );
    const uniqueBusinessNamePairs = new Set(businessNamePairs);

    if (businessNamePairs.length !== uniqueBusinessNamePairs.size) {
      const duplicates = businessNamePairs.filter(
        (item, index) => businessNamePairs.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate item names found within the same business: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // Check for duplicate SKUs within array (if provided)
    const skusInArray = dataArray
      .filter((d) => d.sku)
      .map((d) => normalizeSku(d.sku!));
    const uniqueSkus = new Set(skusInArray);

    if (skusInArray.length !== uniqueSkus.size) {
      const duplicates = skusInArray.filter(
        (item, index) => skusInArray.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate SKUs found in the data array: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // Check for duplicate barcodes within array (if provided)
    const barcodesInArray = dataArray
      .filter((d) => d.barcode)
      .map((d) => normalizeBarcode(d.barcode!));
    const uniqueBarcodes = new Set(barcodesInArray);

    if (barcodesInArray.length !== uniqueBarcodes.size) {
      const duplicates = barcodesInArray.filter(
        (item, index) => barcodesInArray.indexOf(item) !== index
      );
      throw new ValidationError(
        'Validation failed',
        `Duplicate barcodes found in the data array: ${[
          ...new Set(duplicates),
        ].join(', ')}`
      );
    }

    // ========================================================================
    // STEP 4: VERIFY ALL BUSINESSES EXIST
    // ========================================================================

    const uniqueBusinessIds = [...new Set(dataArray.map((d) => d.businessId!))];
    const existingBusinesses = await BusinessModel.findAll({
      where: { businessId: uniqueBusinessIds },
      attributes: ['businessId', 'active'],
      transaction: options?.transaction,
    });

    if (existingBusinesses.length !== uniqueBusinessIds.length) {
      const existingIds = existingBusinesses.map((b) => b.businessId);
      const missingIds = uniqueBusinessIds.filter(
        (id) => !existingIds.includes(id)
      );
      throw new ValidationError(
        'Invalid reference',
        `The following business IDs do not exist: ${missingIds.join(', ')}`
      );
    }

    // Check for inactive businesses
    const inactiveBusinesses = existingBusinesses.filter((b) => !b.active);
    if (inactiveBusinesses.length > 0) {
      throw new ValidationError(
        'Business inactive',
        `Cannot add items to inactive businesses: ${inactiveBusinesses
          .map((b) => b.businessId)
          .join(', ')}`
      );
    }

    // ========================================================================
    // STEP 5: DATABASE DUPLICATE CHECKS
    // ========================================================================

    // Check for existing SKUs in database
    if (skusInArray.length > 0) {
      const existingSkus = await ItemModel.findAll({
        where: { sku: skusInArray },
        attributes: ['sku', 'name'],
        transaction: options?.transaction,
      });

      if (existingSkus.length > 0) {
        const existingSkusStr = existingSkus
          .map((i) => `${i.sku} (${i.name})`)
          .join(', ');
        throw new ValidationError(
          'Duplicate SKU',
          `The following SKUs already exist: ${existingSkusStr}`
        );
      }
    }

    // Check for existing barcodes in database
    if (barcodesInArray.length > 0) {
      const existingBarcodes = await ItemModel.findAll({
        where: { barcode: barcodesInArray },
        attributes: ['barcode', 'name'],
        transaction: options?.transaction,
      });

      if (existingBarcodes.length > 0) {
        const existingBarcodesStr = existingBarcodes
          .map((i) => `${i.barcode} (${i.name})`)
          .join(', ');
        throw new ValidationError(
          'Duplicate barcode',
          `The following barcodes already exist: ${existingBarcodesStr}`
        );
      }
    }

    // ========================================================================
    // STEP 6: NORMALIZE AND SANITIZE DATA
    // ========================================================================

    const normalizedData = dataArray.map((data) => {
      const normalized: any = {
        businessId: data.businessId,
        name: normalizeName(data.name!),
        price: data.price,
        type: data.type || ItemType.OTHER,
        currency: data.currency || 'EUR',
        spicyLevel: data.spicyLevel || SpicyLevel.NONE,

        // Boolean defaults
        isHalal: data.isHalal ?? false,
        isKosher: data.isKosher ?? false,
        isVegan: data.isVegan ?? false,
        isVegetarian: data.isVegan ? true : data.isVegetarian ?? false,
        isGlutenFree: data.isGlutenFree ?? false,
        isLactoseFree: data.isLactoseFree ?? false,
        isOrganic: data.isOrganic ?? false,
        isBio: data.isBio ?? false,
        isHomemade: data.isHomemade ?? false,

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

        isRaw: data.isRaw ?? false,
        isCooked: data.isCooked ?? true,
        isFried: data.isFried ?? false,
        isGrilled: data.isGrilled ?? false,
        isSteamed: data.isSteamed ?? false,

        available: data.available ?? true,
        availableForDelivery: data.availableForDelivery ?? true,
        availableForPickup: data.availableForPickup ?? true,
        availableForDineIn: data.availableForDineIn ?? true,

        minOrderQuantity: data.minOrderQuantity ?? 1,
        sortOrder: data.sortOrder ?? 0,
        featured: data.featured ?? false,
      };

      // Add optional fields
      if (data.description) normalized.description = data.description.trim();
      if (data.shortDescription)
        normalized.shortDescription = data.shortDescription.trim();
      if (data.category) normalized.category = data.category;
      if (data.discountPrice !== undefined)
        normalized.discountPrice = data.discountPrice;
      if (data.discountStartDate)
        normalized.discountStartDate = data.discountStartDate;
      if (data.discountEndDate)
        normalized.discountEndDate = data.discountEndDate;
      if (data.allergenNotes)
        normalized.allergenNotes = data.allergenNotes.trim();
      if (data.servingSize) normalized.servingSize = data.servingSize.trim();
      if (data.calories !== undefined) normalized.calories = data.calories;
      if (data.protein !== undefined) normalized.protein = data.protein;
      if (data.carbohydrates !== undefined)
        normalized.carbohydrates = data.carbohydrates;
      if (data.fat !== undefined) normalized.fat = data.fat;
      if (data.fiber !== undefined) normalized.fiber = data.fiber;
      if (data.sugar !== undefined) normalized.sugar = data.sugar;
      if (data.sodium !== undefined) normalized.sodium = data.sodium;
      if (data.stockQuantity !== undefined)
        normalized.stockQuantity = data.stockQuantity;
      if (data.lowStockThreshold !== undefined)
        normalized.lowStockThreshold = data.lowStockThreshold;
      if (data.preparationTime !== undefined)
        normalized.preparationTime = data.preparationTime;
      if (data.maxOrderQuantity !== undefined)
        normalized.maxOrderQuantity = data.maxOrderQuantity;
      if (data.imageUrl) normalized.imageUrl = data.imageUrl.trim();
      if (data.thumbnailUrl) normalized.thumbnailUrl = data.thumbnailUrl.trim();
      if (data.sku) normalized.sku = normalizeSku(data.sku);
      if (data.barcode) normalized.barcode = normalizeBarcode(data.barcode);
      if (data.tags) normalized.tags = data.tags;

      return normalized;
    });

    // ========================================================================
    // STEP 7: DATABASE BULK CREATE OPERATION
    // ========================================================================

    const records = await ItemModel.bulkCreate(
      normalizedData as any[],
      {
        transaction: options?.transaction,
        validate: options?.validate !== undefined ? options.validate : true,
        ignoreDuplicates: options?.ignoreDuplicates,
        updateOnDuplicate: options?.updateOnDuplicate as any,
      }
    );

    return {
      success: true,
      data: records,
      message: `Successfully created ${records.length} business item${
        records.length > 1 ? 's' : ''
      }`,
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
        'Validation failed for Business Items',
        error.message
      );
    }

    if (
      error instanceof Error &&
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      throw new ValidationError(
        'Duplicate entry',
        'One or more business items with these values already exist'
      );
    }

    if (
      error instanceof Error &&
      error.name === 'SequelizeForeignKeyConstraintError'
    ) {
      throw new ValidationError(
        'Invalid reference',
        'One or more business IDs do not exist'
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

    console.error('Bulk create error:', error);
    throw new ValidationError(
      'Error bulk creating Business Items',
      error instanceof Error ? error.message : String(error)
    );
  }
};
