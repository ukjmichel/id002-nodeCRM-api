// src/interfaces/menu.interface.ts
/**
 * =============================================================================
 * Menu Interface
 * =============================================================================
 * TypeScript interface for business menus containing items with their
 * quantities, active options, and default item selections.
 * =============================================================================
 */

import { Document, Model } from 'mongoose';

/**
 * Interface for individual menu item with configuration
 */
export interface IMenuItem {
  itemId: string;
  quantity: number;
  activeOptions: string[];
  defaultItems: string[];
}

/**
 * Base interface for Menu
 */
export interface IMenu {
  menuId: string;
  name: string;
  description: string;
  items: IMenuItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface with document methods
 */
export interface IMenuDocument extends IMenu, Document {
  // Instance methods - Item management
  addItem(
    itemId: string,
    quantity?: number,
    activeOptions?: string[],
    defaultItems?: string[]
  ): void;
  removeItem(itemId: string): void;
  hasItem(itemId: string): boolean;
  getItem(itemId: string): IMenuItem | undefined;
  updateItemQuantity(itemId: string, quantity: number): boolean;
  getItemCount(): number;

  // Instance methods - Active Options management
  addActiveOption(itemId: string, optionId: string): boolean;
  removeActiveOption(itemId: string, optionId: string): boolean;
  hasActiveOption(itemId: string, optionId: string): boolean;
  getActiveOptions(itemId: string): string[];

  // Instance methods - Default Items management
  addDefaultItem(itemId: string, defaultItemId: string): boolean;
  removeDefaultItem(itemId: string, defaultItemId: string): boolean;
  hasDefaultItem(itemId: string, defaultItemId: string): boolean;
  getDefaultItems(itemId: string): string[];
}

/**
 * Interface for static methods (Model methods)
 */
export interface IMenuModel extends Model<IMenuDocument> {
  findByMenuId(menuId: string): Promise<IMenuDocument | null>;
  findByItemId(itemId: string): Promise<IMenuDocument[]>;
  findByName(name: string): Promise<IMenuDocument[]>;
}
