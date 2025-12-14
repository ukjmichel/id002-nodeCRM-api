// src/interfaces/menu.interface.ts
/**
 * =============================================================================
 * Menu Interface
 * =============================================================================
 * TypeScript interfaces for business menus
 * =============================================================================
 */

import { Document, Model } from 'mongoose';

/**
 * Interface for individual menu item
 */
export interface IMenuItem {
  /** UUID reference to Item in SQL database */
  itemId: string;
  /** Quantity of item (1-1000) */
  quantity: number;
  /** Whether options are allowed for this item in this menu */
  allowOptions: boolean;
  /** Array of optionId references to OptionGroup documents */
  optionIds?: string[];
  /** Sort order within the menu */
  sortOrder?: number;
  /** Whether this item is active in this menu */
  active?: boolean;
}

/**
 * Interface for menu option group reference
 */
export interface IMenuOptionGroup {
  /** Reference to OptionGroup optionId */
  optionId: string;
  /** Sort order within the menu */
  sortOrder?: number;
  /** Whether this option group is required */
  required?: boolean;
}

/**
 * Base interface for Menu
 */
export interface IMenu {
  menuId: string;
  name: string;
  description: string;
  items: IMenuItem[];
  /** Option groups available for this menu */
  optionGroups?: IMenuOptionGroup[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface with document methods
 */
export interface IMenuDocument extends IMenu, Document {
  // Item management methods
  addItem(itemId: string, quantity?: number, allowOptions?: boolean): void;
  removeItem(itemId: string): void;
  hasItem(itemId: string): boolean;
  getItem(itemId: string): IMenuItem | undefined;
  updateItemQuantity(itemId: string, quantity: number): boolean;
  setItemAllowOptions(itemId: string, allowOptions: boolean): boolean;
  isOptionsAllowed(itemId: string): boolean;
  getItemCount(): number;
  getItemsWithOptions(): IMenuItem[];
  getItemsWithoutOptions(): IMenuItem[];
  getItemIds(): string[];
  getTotalQuantity(): number;

  // Option management methods
  addOptionToItem(itemId: string, optionId: string): boolean;
  removeOptionFromItem(itemId: string, optionId: string): boolean;
  getItemOptions(itemId: string): string[];
  hasItemOption(itemId: string, optionId: string): boolean;
}

/**
 * Interface for static methods (Model methods)
 */
export interface IMenuModel extends Model<IMenuDocument> {
  findByMenuId(menuId: string): Promise<IMenuDocument | null>;
  findByItemId(itemId: string): Promise<IMenuDocument[]>;
  findByName(name: string): Promise<IMenuDocument[]>;
  findByItemIdWithOptions(itemId: string): Promise<IMenuDocument[]>;
}

/**
 * Input for creating a new menu
 */
export interface CreateMenuInput {
  menuId: string;
  name: string;
  description: string;
  items?: IMenuItem[];
  optionGroups?: IMenuOptionGroup[];
}

/**
 * Input for updating a menu
 */
export interface UpdateMenuInput {
  name?: string;
  description?: string;
  items?: IMenuItem[];
  optionGroups?: IMenuOptionGroup[];
}

/**
 * Input for adding an item to a menu
 */
export interface AddMenuItemInput {
  itemId: string;
  quantity?: number;
  allowOptions?: boolean;
  optionIds?: string[];
  sortOrder?: number;
  active?: boolean;
}

/**
 * Input for bulk adding items to a menu
 */
export interface BulkAddMenuItemsInput {
  items: AddMenuItemInput[];
}

/**
 * Input for updating a menu item
 */
export interface UpdateMenuItemInput {
  quantity?: number;
  allowOptions?: boolean;
  optionIds?: string[];
  sortOrder?: number;
  active?: boolean;
}

/**
 * Input for adding an option group to menu
 */
export interface AddMenuOptionGroupInput {
  optionId: string;
  sortOrder?: number;
  required?: boolean;
}
