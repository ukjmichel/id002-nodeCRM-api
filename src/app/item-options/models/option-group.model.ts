// src/models/option-group.model.ts
/**
 * =============================================================================
 * OptionGroupModel – Mongoose
 * =============================================================================
 * Stores information about option groups that can be applied to business items.
 * For example: size options (small, medium, large), extras, customizations, etc.
 *
 * Each option group can be associated with multiple items, with individual
 * settings for maxQuantity and active status per item.
 * =============================================================================
 */

import { Schema, model } from 'mongoose';
import { IOptionGroupDocument, IOptionGroupItem, IOptionGroupModel } from '../interfaces/option-group.interface.';


// =========================================================================
// Sub-Schema for Option Group Items
// =========================================================================

const OptionGroupItemSchema = new Schema<IOptionGroupItem>(
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

const OptionGroupSchema = new Schema<IOptionGroupDocument>(
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
      type: [OptionGroupItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'option_groups',
  }
);

// =========================================================================
// Indexes
// =========================================================================

OptionGroupSchema.index({ optionId: 1 }, { unique: true });
OptionGroupSchema.index({ 'items.itemId': 1 }); // Index for querying by itemId
OptionGroupSchema.index({ 'items.active': 1 }); // Index for querying active items
OptionGroupSchema.index({ description: 1 });

// =========================================================================
// Middleware/Hooks
// =========================================================================

// Pre-save hook to normalize fields
OptionGroupSchema.pre('save', function (next) {
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

OptionGroupSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

/**
 * Add an item to this option group with optional maxQuantity and active status
 */
OptionGroupSchema.methods.addItem = function (
  itemId: string,
  maxQuantity: number = 1,
  active: boolean = true
): void {
  const existingIndex = this.items.findIndex(
    (item: IOptionGroupItem) => item.itemId === itemId
  );

  if (existingIndex === -1) {
    this.items.push({ itemId, maxQuantity, active });
  }
};

/**
 * Remove an item from this option group
 */
OptionGroupSchema.methods.removeItem = function (itemId: string): void {
  this.items = this.items.filter(
    (item: IOptionGroupItem) => item.itemId !== itemId
  );
};

/**
 * Check if this option group includes a specific item
 */
OptionGroupSchema.methods.hasItem = function (itemId: string): boolean {
  return this.items.some((item: IOptionGroupItem) => item.itemId === itemId);
};

/**
 * Get a specific item configuration
 */
OptionGroupSchema.methods.getItem = function (
  itemId: string
): IOptionGroupItem | undefined {
  return this.items.find((item: IOptionGroupItem) => item.itemId === itemId);
};

/**
 * Update an item's maxQuantity
 */
OptionGroupSchema.methods.updateMaxQuantity = function (
  itemId: string,
  maxQuantity: number
): boolean {
  const item = this.items.find(
    (item: IOptionGroupItem) => item.itemId === itemId
  );
  if (item) {
    item.maxQuantity = maxQuantity;
    return true;
  }
  return false;
};

/**
 * Set an item's active status
 */
OptionGroupSchema.methods.setItemActive = function (
  itemId: string,
  active: boolean
): boolean {
  const item = this.items.find(
    (item: IOptionGroupItem) => item.itemId === itemId
  );
  if (item) {
    item.active = active;
    return true;
  }
  return false;
};

/**
 * Get the number of items associated with this option group
 */
OptionGroupSchema.methods.getItemCount = function (): number {
  return this.items.length;
};

/**
 * Get the number of active items associated with this option group
 */
OptionGroupSchema.methods.getActiveItemCount = function (): number {
  return this.items.filter((item: IOptionGroupItem) => item.active).length;
};

/**
 * Get all active items
 */
OptionGroupSchema.methods.getActiveItems = function (): IOptionGroupItem[] {
  return this.items.filter((item: IOptionGroupItem) => item.active);
};

/**
 * Get all item IDs
 */
OptionGroupSchema.methods.getItemIds = function (): string[] {
  return this.items.map((item: IOptionGroupItem) => item.itemId);
};

// =========================================================================
// Static Methods
// =========================================================================

/**
 * Find option groups by item ID
 */
OptionGroupSchema.statics.findByItemId = function (itemId: string) {
  return this.find({ 'items.itemId': itemId });
};

/**
 * Find option groups by item ID where the item is active
 */
OptionGroupSchema.statics.findByActiveItemId = function (itemId: string) {
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
 * Find option group by optionId
 */
OptionGroupSchema.statics.findByOptionId = function (optionId: string) {
  return this.findOne({ optionId });
};

/**
 * Find all option groups with at least one active item
 */
OptionGroupSchema.statics.findWithActiveItems = function () {
  return this.find({ 'items.active': true });
};

// =========================================================================
// Model Export
// =========================================================================

export const OptionGroupModel = model<IOptionGroupDocument, IOptionGroupModel>(
  'OptionGroup',
  OptionGroupSchema
);

export type OptionGroupModelType = typeof OptionGroupModel;
