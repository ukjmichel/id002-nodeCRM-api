/**
 * Update Business Item Service
 * Updates a business item record by ID with comprehensive validation and database checks
 */

import type { UpdateOptions } from 'sequelize';
import { ItemAttributes } from '../interfaces/item.interface.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { ItemModel } from '../models/item.model.js';
import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
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
  shouldValidateField,
} from '../utils/validation.js';

// Immutable fields that cannot be updated
const IMMUTABLE_FIELDS = ['itemId', 'businessId'] as const;
const AUTO_MANAGED_FIELDS = ['createdAt', 'updatedAt'] as const;

/**
 * Options for update operation
 */
type UpdateItemOptions = Pick<UpdateOptions<any>, 'transaction'>;

/**
 * Update a business item by ID
 *
 * @param id - Business item ID
 * @param data - Data to update
 * @param options - Update options (transaction support)
 * @returns Updated business item record
 * @throws {NotFoundError} When business item is not found
 * @throws {ValidationError} When update fails
 *
 * @example
 * ```typescript
 * const updatedItem = await updateItem('item-uuid-here', {
 *   price: 14.99,
 *   available: false
 * });
 * ```
 */
export const updateItem = async (
  id: string,
  data: Partial<ItemAttributes>,
  options?: UpdateItemOptions
): Promise<ApiResponse<ItemModel>> => {
  try {
    // ========================================================================
    // STEP 1: ID VALIDATION
    // ========================================================================

    if (!id) {
      throw new ValidationError('Validation failed', 'Item ID is required');
    }

    validateUuid(id, 'Item ID');

    // ========================================================================
    // STEP 2: FETCH CURRENT RECORD (DATABASE CHECK)
    // ========================================================================

    const record = await ItemModel.findByPk(id, {
      transaction: options?.transaction,
    });

    if (!record) {
      throw new NotFoundError(`Business item with ID ${id} not found`);
    }

    // ========================================================================
    // STEP 3: VALIDATE IMMUTABLE FIELDS
    // ========================================================================

    for (const field of IMMUTABLE_FIELDS) {
      if (field in data) {
        const fieldName = field === 'itemId' ? 'Item ID' : 'Business ID';
        throw new ValidationError(
          'Invalid field',
          `${fieldName} cannot be updated`
        );
      }
    }

    // ========================================================================
    // STEP 4: VALIDATE DATA TYPES
    // ========================================================================

    if (Object.keys(data).length === 0) {
      throw new ValidationError(
        'Validation failed',
        'No fields provided for update'
      );
    }

    // ========================================================================
    // STEP 5: FORMAT VALIDATIONS
    // ========================================================================

    // Validate item type if provided
    if (data.type && data.type !== record.type) {
      validateItemType(data.type);
    }

    // Validate item category if provided
    if (data.category && data.category !== record.category) {
      validateItemCategory(data.category);
    }

    // Validate spicy level if provided
    if (data.spicyLevel && data.spicyLevel !== record.spicyLevel) {
      validateSpicyLevel(data.spicyLevel);
    }

    // Validate currency if provided
    if (data.currency && data.currency !== record.currency) {
      validateCurrency(data.currency);
    }

    // Validate price if provided
    if (data.price !== undefined && data.price !== record.price) {
      validatePrice(data.price, 'Price');
    }

    // Validate discount pricing
    const newPrice = data.price ?? record.price;
    const newDiscountPrice = data.discountPrice ?? record.discountPrice;
    const newDiscountStartDate =
      data.discountStartDate ?? record.discountStartDate;
    const newDiscountEndDate = data.discountEndDate ?? record.discountEndDate;

    if (
      data.discountPrice !== undefined ||
      data.discountStartDate !== undefined ||
      data.discountEndDate !== undefined
    ) {
      validateDiscountPricing(
        newPrice,
        newDiscountPrice,
        newDiscountStartDate,
        newDiscountEndDate
      );
    }

    // Validate order quantities
    const newMinOrderQuantity =
      data.minOrderQuantity ?? record.minOrderQuantity;
    const newMaxOrderQuantity =
      data.maxOrderQuantity ?? record.maxOrderQuantity;

    if (
      data.minOrderQuantity !== undefined ||
      data.maxOrderQuantity !== undefined
    ) {
      validateOrderQuantities(newMinOrderQuantity, newMaxOrderQuantity);
    }

    // Validate URLs if provided
    if (data.imageUrl && shouldValidateField(record.imageUrl, data.imageUrl)) {
      validateUrl(data.imageUrl, 'Image URL');
    }
    if (
      data.thumbnailUrl &&
      shouldValidateField(record.thumbnailUrl, data.thumbnailUrl)
    ) {
      validateUrl(data.thumbnailUrl, 'Thumbnail URL');
    }

    // Validate nutritional values if provided
    if (data.calories !== undefined && data.calories !== record.calories) {
      validateNutritionalValue(data.calories, 'Calories');
    }
    if (data.protein !== undefined && data.protein !== record.protein) {
      validateNutritionalValue(data.protein, 'Protein');
    }
    if (
      data.carbohydrates !== undefined &&
      data.carbohydrates !== record.carbohydrates
    ) {
      validateNutritionalValue(data.carbohydrates, 'Carbohydrates');
    }
    if (data.fat !== undefined && data.fat !== record.fat) {
      validateNutritionalValue(data.fat, 'Fat');
    }
    if (data.fiber !== undefined && data.fiber !== record.fiber) {
      validateNutritionalValue(data.fiber, 'Fiber');
    }
    if (data.sugar !== undefined && data.sugar !== record.sugar) {
      validateNutritionalValue(data.sugar, 'Sugar');
    }
    if (data.sodium !== undefined && data.sodium !== record.sodium) {
      validateNutritionalValue(data.sodium, 'Sodium');
    }

    // Validate stock quantities if provided
    if (
      data.stockQuantity !== undefined &&
      data.stockQuantity !== record.stockQuantity
    ) {
      validateQuantity(data.stockQuantity, 'Stock quantity', 0);
    }
    if (
      data.lowStockThreshold !== undefined &&
      data.lowStockThreshold !== record.lowStockThreshold
    ) {
      validateQuantity(data.lowStockThreshold, 'Low stock threshold', 0);
    }

    // Validate preparation time if provided
    if (
      data.preparationTime !== undefined &&
      data.preparationTime !== record.preparationTime
    ) {
      validateQuantity(data.preparationTime, 'Preparation time', 0);
    }

    // Validate dietary consistency (merge with current values)
    validateDietaryConsistency({
      isVegan: data.isVegan ?? record.isVegan,
      isVegetarian: data.isVegetarian ?? record.isVegetarian,
      isLactoseFree: data.isLactoseFree ?? record.isLactoseFree,
      isGlutenFree: data.isGlutenFree ?? record.isGlutenFree,
      containsMilk: data.containsMilk ?? record.containsMilk,
      containsEggs: data.containsEggs ?? record.containsEggs,
      containsFish: data.containsFish ?? record.containsFish,
      containsShellfish: data.containsShellfish ?? record.containsShellfish,
      containsWheat: data.containsWheat ?? record.containsWheat,
    });

    // ========================================================================
    // STEP 6: DATABASE UNIQUENESS CHECKS
    // ========================================================================

    // Check for duplicate name within the same business (excluding current item)
    if (data.name && shouldValidateField(record.name, data.name)) {
      const existingName = await ItemModel.findOne({
        where: {
          businessId: record.businessId,
          name: normalizeName(data.name),
        },
        attributes: ['itemId', 'name'],
        transaction: options?.transaction,
      });

      if (existingName && existingName.itemId !== record.itemId) {
        throw new ValidationError(
          'Duplicate name',
          `An item with name '${data.name}' already exists for this business`
        );
      }
    }

    // Check for duplicate SKU (excluding current item)
    if (data.sku && shouldValidateField(record.sku, data.sku)) {
      const existingSku = await ItemModel.findOne({
        where: { sku: normalizeSku(data.sku) },
        attributes: ['itemId', 'sku', 'name'],
        transaction: options?.transaction,
      });

      if (existingSku && existingSku.itemId !== record.itemId) {
        throw new ValidationError(
          'Duplicate SKU',
          `An item with SKU '${data.sku}' already exists (${existingSku.name})`
        );
      }
    }

    // Check for duplicate barcode (excluding current item)
    if (data.barcode && shouldValidateField(record.barcode, data.barcode)) {
      const existingBarcode = await ItemModel.findOne({
        where: { barcode: normalizeBarcode(data.barcode) },
        attributes: ['itemId', 'barcode', 'name'],
        transaction: options?.transaction,
      });

      if (existingBarcode && existingBarcode.itemId !== record.itemId) {
        throw new ValidationError(
          'Duplicate barcode',
          `An item with barcode '${data.barcode}' already exists (${existingBarcode.name})`
        );
      }
    }

    // ========================================================================
    // STEP 7: PREPARE UPDATE DATA
    // ========================================================================

    const updateData: Partial<ItemAttributes> = { ...data };

    // If making vegan, automatically set vegetarian
    if (updateData.isVegan === true) {
      updateData.isVegetarian = true;
    }

    // ========================================================================
    // STEP 8: NORMALIZE AND SANITIZE DATA
    // ========================================================================

    if (updateData.name) {
      updateData.name = normalizeName(updateData.name);
    }
    if (updateData.description) {
      updateData.description = updateData.description.trim();
    }
    if (updateData.shortDescription) {
      updateData.shortDescription = updateData.shortDescription.trim();
    }
    if (updateData.allergenNotes) {
      updateData.allergenNotes = updateData.allergenNotes.trim();
    }
    if (updateData.servingSize) {
      updateData.servingSize = updateData.servingSize.trim();
    }
    if (updateData.imageUrl) {
      updateData.imageUrl = updateData.imageUrl.trim();
    }
    if (updateData.thumbnailUrl) {
      updateData.thumbnailUrl = updateData.thumbnailUrl.trim();
    }
    if (updateData.sku) {
      updateData.sku = normalizeSku(updateData.sku);
    }
    if (updateData.barcode) {
      updateData.barcode = normalizeBarcode(updateData.barcode);
    }

    // ========================================================================
    // STEP 9: CHECK FOR ACTUAL CHANGES
    // ========================================================================

    const allProtectedFields = [...IMMUTABLE_FIELDS, ...AUTO_MANAGED_FIELDS];
    let hasChanges = false;

    for (const key of Object.keys(updateData)) {
      if (allProtectedFields.includes(key as any)) continue;

      const currentValue = (record as any)[key];
      const newValue = (updateData as any)[key];

      if (currentValue == null && newValue == null) continue;

      if (currentValue instanceof Date && newValue instanceof Date) {
        if (currentValue.getTime() !== newValue.getTime()) {
          hasChanges = true;
          break;
        }
        continue;
      }

      if (currentValue !== newValue) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      return {
        success: true,
        data: record,
        message: 'No changes detected - item data is already up to date',
      };
    }

    // ========================================================================
    // STEP 10: DATABASE UPDATE OPERATION
    // ========================================================================

    // Remove protected fields from update data
    for (const field of allProtectedFields) {
      delete (updateData as any)[field];
    }

    await record.update(updateData as any, {
      transaction: options?.transaction,
    });

    await record.reload({ transaction: options?.transaction });

    return {
      success: true,
      data: record,
      message: 'Business item updated successfully',
    };
  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================

    if (error instanceof NotFoundError || error instanceof ValidationError) {
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
      'Error updating Business Item',
      error instanceof Error ? error.message : String(error)
    );
  }
};
