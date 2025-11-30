// src/models/item-options.model.ts
/**
 * =============================================================================
 * ItemOptionsModel – Mongoose
 * =============================================================================
 * Stores information about item options that can be applied to business items.
 * For example: size options (small, medium, large), extras, customizations, etc.
 *
 * Each option can be associated with multiple items, with individual settings
 * for maxQuantity and active status per item.
 * =============================================================================
 */

import { Schema, model, Types } from 'mongoose';
import { IItemOptionsDocument, IItemOptionsModel, IOptionItem } from '../interfaces/item-option.interface';


// =========================================================================
// Sub-Schema for Option Items
// =========================================================================

const OptionItemSchema = new Schema<IOptionItem>(
  {
    itemId: {
      type: String,
      required: [true, 'Item ID is required'],
      validate: {
        validator: function (v: string): boolean {
          // UUID validation for itemId from Item model
          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          return uuidRegex.test(v);
        },
        message: (props: any) =>
          `${props.value} is not a valid item ID (UUID format expected)`,
      },
    },
    maxQuantity: {
      type: Number,
      required: [true, 'Max quantity is required'],
      min: [1, 'Max quantity must be at least 1'],
      max: [100, 'Max quantity cannot exceed 100'],
      default: 1,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    _id: false, // Don't create _id for subdocuments
  }
);

// =========================================================================
// Main Schema Definition
// =========================================================================

const ItemOptionsSchema = new Schema<IItemOptionsDocument>(
  {
    optionId: {
      type: String,
      required: [true, 'Option ID is required'],
      unique: true,
      index: true,
      trim: true,
      validate: {
        validator: function (v: string): boolean {
          return !!(v && v.length > 0);
        },
        message: 'Option ID cannot be empty',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [3, 'Description must be at least 3 characters long'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    items: {
      type: [OptionItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'business_item_options',
  }
);

// =========================================================================
// Indexes
// =========================================================================

ItemOptionsSchema.index({ optionId: 1 }, { unique: true });
ItemOptionsSchema.index({ 'items.itemId': 1 }); // Index for querying by itemId
ItemOptionsSchema.index({ 'items.active': 1 }); // Index for querying active items
ItemOptionsSchema.index({ description: 1 });

// =========================================================================
// Middleware/Hooks
// =========================================================================

// Pre-save hook to normalize fields
ItemOptionsSchema.pre('save', function (next) {
  // Trim and normalize optionId
  if (this.isModified('optionId')) {
    this.optionId = this.optionId.trim();
  }

  // Trim description
  if (this.isModified('description')) {
    this.description = this.description.trim();
  }

  // Remove duplicate itemIds from items array (keep first occurrence)
  if (this.isModified('items')) {
    const seen = new Set<string>();
    this.items = this.items.filter((item) => {
      if (seen.has(item.itemId)) {
        return false;
      }
      seen.add(item.itemId);
      return true;
    });
  }

  next();
});

// =========================================================================
// Instance Methods
// =========================================================================

ItemOptionsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

/**
 * Add an item to this option with optional maxQuantity and active status
 */
ItemOptionsSchema.methods.addItem = function (
  itemId: string,
  maxQuantity: number = 1,
  active: boolean = true
): void {
  const existingIndex = this.items.findIndex(
    (item: IOptionItem) => item.itemId === itemId
  );

  if (existingIndex === -1) {
    this.items.push({ itemId, maxQuantity, active });
  }
};

/**
 * Remove an item from this option
 */
ItemOptionsSchema.methods.removeItem = function (itemId: string): void {
  this.items = this.items.filter((item: IOptionItem) => item.itemId !== itemId);
};

/**
 * Check if this option includes a specific item
 */
ItemOptionsSchema.methods.hasItem = function (itemId: string): boolean {
  return this.items.some((item: IOptionItem) => item.itemId === itemId);
};

/**
 * Get a specific item configuration
 */
ItemOptionsSchema.methods.getItem = function (
  itemId: string
): IOptionItem | undefined {
  return this.items.find((item: IOptionItem) => item.itemId === itemId);
};

/**
 * Update an item's maxQuantity
 */
ItemOptionsSchema.methods.updateMaxQuantity = function (
  itemId: string,
  maxQuantity: number
): boolean {
  const item = this.items.find((item: IOptionItem) => item.itemId === itemId);
  if (item) {
    item.maxQuantity = maxQuantity;
    return true;
  }
  return false;
};

/**
 * Set an item's active status
 */
ItemOptionsSchema.methods.setItemActive = function (
  itemId: string,
  active: boolean
): boolean {
  const item = this.items.find((item: IOptionItem) => item.itemId === itemId);
  if (item) {
    item.active = active;
    return true;
  }
  return false;
};

/**
 * Get the number of items associated with this option
 */
ItemOptionsSchema.methods.getItemCount = function (): number {
  return this.items.length;
};

/**
 * Get the number of active items associated with this option
 */
ItemOptionsSchema.methods.getActiveItemCount = function (): number {
  return this.items.filter((item: IOptionItem) => item.active).length;
};

/**
 * Get all active items
 */
ItemOptionsSchema.methods.getActiveItems = function (): IOptionItem[] {
  return this.items.filter((item: IOptionItem) => item.active);
};

/**
 * Get all item IDs (for backward compatibility)
 */
ItemOptionsSchema.methods.getItemIds = function (): string[] {
  return this.items.map((item: IOptionItem) => item.itemId);
};

// =========================================================================
// Static Methods
// =========================================================================

/**
 * Find options by item ID
 */
ItemOptionsSchema.statics.findByItemId = function (itemId: string) {
  return this.find({ 'items.itemId': itemId });
};

/**
 * Find options by item ID where the item is active
 */
ItemOptionsSchema.statics.findByActiveItemId = function (itemId: string) {
  return this.find({
    items: {
      $elemMatch: {
        itemId: itemId,
        active: true,
      },
    },
  });
};

/**
 * Find option by optionId
 */
ItemOptionsSchema.statics.findByOptionId = function (optionId: string) {
  return this.findOne({ optionId });
};

/**
 * Find all options with at least one active item
 */
ItemOptionsSchema.statics.findWithActiveItems = function () {
  return this.find({ 'items.active': true });
};

// =========================================================================
// Model Export - Properly Typed with Static Methods
// =========================================================================

export const ItemOptionsModel = model<IItemOptionsDocument, IItemOptionsModel>(
  'ItemOptions',
  ItemOptionsSchema
);

// Type helper for additional type safety
export type ItemOptionsModelType = typeof ItemOptionsModel;
