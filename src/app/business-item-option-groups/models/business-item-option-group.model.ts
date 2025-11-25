// src/models/business-item-option-group.model.ts
/**
 * =============================================================================
 * BusinessItemOptionGroupModel – Mongoose
 * =============================================================================
 * Stores information about item option groups that can be applied to business items.
 * For example: size options (small, medium, large), extras, customizations, etc.
 *
 * Each option group can be associated with multiple business items.
 * =============================================================================
 */

import { Schema, model } from 'mongoose';
import {
  IBusinessItemOptionGroup,
  IBusinessItemOptionGroupDocument,
  IBusinessItemOptionGroupModel,
} from '../interfaces/business-item-option-group.interface';

// =========================================================================
// Schema Definition
// =========================================================================

const businessItemOptionGroupSchema =
  new Schema<IBusinessItemOptionGroupDocument>(
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
      items: [
        {
          type: String,
          required: true,
          validate: {
            validator: function (v: string): boolean {
              // Basic UUID validation (for itemId from BusinessItem)
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              return uuidRegex.test(v);
            },
            message: (props: any) =>
              `${props.value} is not a valid item ID (UUID format expected)`,
          },
        },
      ],
    },
    {
      timestamps: true,
      collection: 'business_item_option_groups',
    }
  );

// =========================================================================
// Indexes
// =========================================================================

businessItemOptionGroupSchema.index({ optionId: 1 }, { unique: true });
businessItemOptionGroupSchema.index({ items: 1 }); // Index for querying by itemId
businessItemOptionGroupSchema.index({ description: 1 });

// =========================================================================
// Middleware/Hooks
// =========================================================================

// Pre-save hook to normalize fields
businessItemOptionGroupSchema.pre('save', function (next) {
  // Trim and normalize optionId
  if (this.isModified('optionId')) {
    this.optionId = this.optionId.trim();
  }

  // Trim description
  if (this.isModified('description')) {
    this.description = this.description.trim();
  }

  // Remove duplicate itemIds from items array
  if (this.isModified('items')) {
    this.items = [...new Set(this.items)];
  }

  next();
});

// =========================================================================
// Instance Methods
// =========================================================================

businessItemOptionGroupSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

/**
 * Add an item to this option group
 */
businessItemOptionGroupSchema.methods.addItem = function (
  itemId: string
): void {
  if (!this.items.includes(itemId)) {
    this.items.push(itemId);
  }
};

/**
 * Remove an item from this option group
 */
businessItemOptionGroupSchema.methods.removeItem = function (
  itemId: string
): void {
  this.items = this.items.filter((id: string) => id !== itemId);
};

/**
 * Check if this option group includes a specific item
 */
businessItemOptionGroupSchema.methods.hasItem = function (
  itemId: string
): boolean {
  return this.items.includes(itemId);
};

/**
 * Get the number of items associated with this option group
 */
businessItemOptionGroupSchema.methods.getItemCount = function (): number {
  return this.items.length;
};

// =========================================================================
// Static Methods
// =========================================================================

/**
 * Find option groups by item ID
 */
businessItemOptionGroupSchema.statics.findByItemId = function (itemId: string) {
  return this.find({ items: itemId });
};

/**
 * Find option group by optionId
 */
businessItemOptionGroupSchema.statics.findByOptionId = function (
  optionId: string
) {
  return this.findOne({ optionId });
};

// =========================================================================
// Model Export - Properly Typed with Static Methods
// =========================================================================

export const BusinessItemOptionGroupModel = model<
  IBusinessItemOptionGroupDocument,
  IBusinessItemOptionGroupModel
>('BusinessItemOptionGroup', businessItemOptionGroupSchema);

// Type helper for additional type safety
export type BusinessItemOptionGroupModelType =
  typeof BusinessItemOptionGroupModel;
