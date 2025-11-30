// src/models/menu.model.ts
/**
 * =============================================================================
 * MenuModel – Mongoose
 * =============================================================================
 * Stores information about business menus containing items with their
 * quantities, active options, and default item selections.
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
    activeOptions: {
      type: [String],
      default: [],
    },
    defaultItems: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]): boolean {
          return v.every((id) => {
            const uuidRegex =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(id);
          });
        },
        message: 'All default items must be valid UUIDs',
      },
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

MenuSchema.pre('save', function (next) {
  if (this.isModified('menuId')) {
    this.menuId = this.menuId.trim();
  }

  if (this.isModified('name')) {
    this.name = this.name.trim();
  }

  if (this.isModified('description')) {
    this.description = this.description.trim();
  }

  // Remove duplicate itemIds from items array
  if (this.isModified('items')) {
    const seen = new Set<string>();
    this.items = this.items.filter((item) => {
      if (seen.has(item.itemId)) {
        return false;
      }
      seen.add(item.itemId);
      return true;
    });

    // Remove duplicates within activeOptions and defaultItems
    this.items.forEach((item) => {
      item.activeOptions = [...new Set(item.activeOptions)];
      item.defaultItems = [...new Set(item.defaultItems)];
    });
  }

  next();
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
  activeOptions: string[] = [],
  defaultItems: string[] = []
): void {
  const existingIndex = this.items.findIndex(
    (item: IMenuItem) => item.itemId === itemId
  );

  if (existingIndex === -1) {
    this.items.push({ itemId, quantity, activeOptions, defaultItems });
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
 * Get the number of items in this menu
 */
MenuSchema.methods.getItemCount = function (): number {
  return this.items.length;
};

// =========================================================================
// Active Options Methods
// =========================================================================

/**
 * Add an active option to an item
 */
MenuSchema.methods.addActiveOption = function (
  itemId: string,
  optionId: string
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;

  if (!item.activeOptions.includes(optionId)) {
    item.activeOptions.push(optionId);
    return true;
  }
  return false;
};

/**
 * Remove an active option from an item
 */
MenuSchema.methods.removeActiveOption = function (
  itemId: string,
  optionId: string
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;

  const initialLength = item.activeOptions.length;
  item.activeOptions = item.activeOptions.filter(
    (id: string) => id !== optionId
  );
  return item.activeOptions.length < initialLength;
};

/**
 * Check if an option is active for an item
 */
MenuSchema.methods.hasActiveOption = function (
  itemId: string,
  optionId: string
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;
  return item.activeOptions.includes(optionId);
};

/**
 * Get all active options for an item
 */
MenuSchema.methods.getActiveOptions = function (itemId: string): string[] {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return [];
  return item.activeOptions;
};

// =========================================================================
// Default Items Methods
// =========================================================================

/**
 * Add a default item to an item
 */
MenuSchema.methods.addDefaultItem = function (
  itemId: string,
  defaultItemId: string
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;

  if (!item.defaultItems.includes(defaultItemId)) {
    item.defaultItems.push(defaultItemId);
    return true;
  }
  return false;
};

/**
 * Remove a default item from an item
 */
MenuSchema.methods.removeDefaultItem = function (
  itemId: string,
  defaultItemId: string
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;

  const initialLength = item.defaultItems.length;
  item.defaultItems = item.defaultItems.filter(
    (id: string) => id !== defaultItemId
  );
  return item.defaultItems.length < initialLength;
};

/**
 * Check if an item has a specific default item
 */
MenuSchema.methods.hasDefaultItem = function (
  itemId: string,
  defaultItemId: string
): boolean {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return false;
  return item.defaultItems.includes(defaultItemId);
};

/**
 * Get all default items for an item
 */
MenuSchema.methods.getDefaultItems = function (itemId: string): string[] {
  const item = this.items.find((item: IMenuItem) => item.itemId === itemId);
  if (!item) return [];
  return item.defaultItems;
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

// =========================================================================
// Model Export
// =========================================================================

export const MenuModel = model<IMenuDocument, IMenuModel>('Menu', MenuSchema);

export type MenuModelType = typeof MenuModel;
