// src/models/menu.model.ts
/**
 * =============================================================================
 * MenuModel – Mongoose
 * =============================================================================
 * Stores information about business menus containing items with their
 * quantities and option allowance settings.
 * =============================================================================
 */

import { Schema, model } from 'mongoose';
import {
  IMenu,
  IMenuDocument,
  IMenuModel,
  IMenuItem,
} from '../interfaces/menu.interface.js';

// =========================================================================
// Sub-Schema for Menu Items
// =========================================================================

const MenuItemSchema = new Schema<IMenuItem>(
  {
    itemId: {
      type: String,
      required: [true, 'Item ID is required'],
      validate: {
        validator: function (v: string): boolean {
          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          return uuidRegex.test(v);
        },
        message: (props: any) =>
          `${props.value} is not a valid item ID (UUID format expected)`,
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [1000, 'Quantity cannot exceed 1000'],
      default: 1,
    },
    allowOptions: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    _id: false,
  }
);

// =========================================================================
// Main Schema Definition
// =========================================================================

const MenuSchema = new Schema<IMenuDocument>(
  {
    menuId: {
      type: String,
      required: [true, 'Menu ID is required'],
      unique: true,
      index: true,
      trim: true,
      validate: {
        validator: function (v: string): boolean {
          return !!(v && v.length > 0);
        },
        message: 'Menu ID cannot be empty',
      },
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [3, 'Description must be at least 3 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    items: {
      type: [MenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'business_menus',
  }
);

// =========================================================================
// Indexes
// =========================================================================

MenuSchema.index({ menuId: 1 }, { unique: true });
MenuSchema.index({ name: 1 });
MenuSchema.index({ 'items.itemId': 1 });

// =========================================================================
// Middleware/Hooks
// =========================================================================

MenuSchema.pre('save', async function (next) {
  try {
    // Trim string fields
    if (this.isModified('menuId')) {
      this.menuId = this.menuId.trim();
    }

    if (this.isModified('name')) {
      this.name = this.name.trim();
    }

    if (this.isModified('description')) {
      this.description = this.description.trim();
    }

    // Process items array
    if (this.isModified('items') && this.items.length > 0) {
      // Remove duplicate itemIds from items array (keep first occurrence)
      const seen = new Set<string>();
      this.items = this.items.filter((item) => {
        if (seen.has(item.itemId)) {
          return false;
        }
        seen.add(item.itemId);
        return true;
      });

      // Validate that all itemIds exist in the Items database (SQL)
      // Import service and error dynamically to avoid circular dependency
      const { findItemById } = await import(
        '../../items/services/findItemById.js'
      );
      const { ValidationError } = await import('../../../core/errors/ValidationError.js');

      const nonExistentItemIds: string[] = [];

      // Check each itemId exists
      for (const item of this.items) {
        try {
          await findItemById(item.itemId);
        } catch (error) {
          // If NotFoundError, item doesn't exist
          if (error instanceof Error && error.name === 'NotFoundError') {
            nonExistentItemIds.push(item.itemId);
          } else {
            throw error;
          }
        }
      }

      if (nonExistentItemIds.length > 0) {
        throw new ValidationError(
          'Invalid item IDs in menu',
          `The following item IDs do not exist: ${nonExistentItemIds.join(
            ', '
          )}`
        );
      }
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// =========================================================================
// Instance Methods
// =========================================================================

MenuSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

/**
 * Add an item to this menu
 */
MenuSchema.methods.addItem = function (
  itemId: string,
  quantity: number = 1,
  allowOptions: boolean = true
): void {
  const existingIndex = this.items.findIndex(
    (item: IMenuItem) => item.itemId === itemId
  );

  if (existingIndex === -1) {
    this.items.push({ itemId, quantity, allowOptions });
  }
};

/**
 * Remove an item from this menu
 */
MenuSchema.methods.removeItem = function (itemId: string): void {
  this.items = this.items.filter((item: IMenuItem) => item.itemId !== itemId);
};

/**
 * Check if this menu includes a specific item
 */
MenuSchema.methods.hasItem = function (itemId: string): boolean {
  return this.items.some((item: IMenuItem) => item.itemId === itemId);
};

/**
 * Get a specific item configuration
 */
MenuSchema.methods.getItem = function (itemId: string): IMenuItem | undefined {
  return this.items.find((item: IMenuItem) => item.itemId === itemId);
};

/**
 * Update an item's quantity
 */
MenuSchema.methods.updateItemQuantity = function (
  itemId: string,
  quantity: number
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (item) {
    item.quantity = quantity;
    return true;
  }
  return false;
};

/**
 * Set an item's allowOptions status
 */
MenuSchema.methods.setItemAllowOptions = function (
  itemId: string,
  allowOptions: boolean
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (item) {
    item.allowOptions = allowOptions;
    return true;
  }
  return false;
};

/**
 * Check if options are allowed for an item
 */
MenuSchema.methods.isOptionsAllowed = function (itemId: string): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;
  return item.allowOptions;
};

/**
 * Get the number of items in this menu
 */
MenuSchema.methods.getItemCount = function (): number {
  return this.items.length;
};

/**
 * Get all items that allow options
 */
MenuSchema.methods.getItemsWithOptions = function (): IMenuItem[] {
  return this.items.filter((item: IMenuItem) => item.allowOptions);
};

/**
 * Get all items that don't allow options
 */
MenuSchema.methods.getItemsWithoutOptions = function (): IMenuItem[] {
  return this.items.filter((item: IMenuItem) => !item.allowOptions);
};

/**
 * Get all item IDs in this menu
 */
MenuSchema.methods.getItemIds = function (): string[] {
  return this.items.map((item: IMenuItem) => item.itemId);
};

/**
 * Get total quantity of all items
 */
MenuSchema.methods.getTotalQuantity = function (): number {
  return this.items.reduce(
    (total: number, item: IMenuItem) => total + item.quantity,
    0
  );
};

// =========================================================================
// Static Methods
// =========================================================================

/**
 * Find menu by menuId
 */
MenuSchema.statics.findByMenuId = function (menuId: string) {
  return this.findOne({ menuId });
};

/**
 * Find menus containing a specific item
 */
MenuSchema.statics.findByItemId = function (itemId: string) {
  return this.find({ 'items.itemId': itemId });
};

/**
 * Find menus by name (partial match)
 */
MenuSchema.statics.findByName = function (name: string) {
  return this.find({ name: { $regex: name, $options: 'i' } });
};

/**
 * Find menus where a specific item allows options
 */
MenuSchema.statics.findByItemIdWithOptions = function (itemId: string) {
  return this.find({
    items: {
      $elemMatch: {
        itemId: itemId,
        allowOptions: true,
      },
    },
  });
};

// =========================================================================
// Model Export
// =========================================================================

export const MenuModel = model<IMenuDocument, IMenuModel>('Menu', MenuSchema);

export type MenuModelType = typeof MenuModel;
