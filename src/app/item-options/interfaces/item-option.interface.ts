// src/interfaces/item-options.interface.ts
/**
 * =============================================================================
 * ItemOptions Interface
 * =============================================================================
 * TypeScript interface for business item options
 * =============================================================================
 */

import { Document, Model } from 'mongoose';

/**
 * Interface for individual option item with configuration
 */
export interface IOptionItem {
  itemId: string;
  maxQuantity: number;
  active: boolean;
}

/**
 * Base interface for ItemOptions
 */
export interface IItemOptions {
  optionId: string;
  description: string;
  items: IOptionItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface with document methods
 */
export interface IItemOptionsDocument extends IItemOptions, Document {
  // Instance methods
  addItem(itemId: string, maxQuantity?: number, active?: boolean): void;
  removeItem(itemId: string): void;
  hasItem(itemId: string): boolean;
  getItem(itemId: string): IOptionItem | undefined;
  updateMaxQuantity(itemId: string, maxQuantity: number): boolean;
  setItemActive(itemId: string, active: boolean): boolean;
  getItemCount(): number;
  getActiveItemCount(): number;
  getActiveItems(): IOptionItem[];
  getItemIds(): string[];
}

/**
 * Interface for static methods (Model methods)
 */
export interface IItemOptionsModel extends Model<IItemOptionsDocument> {
  findByItemId(itemId: string): Promise<IItemOptionsDocument[]>;
  findByActiveItemId(itemId: string): Promise<IItemOptionsDocument[]>;
  findByOptionId(optionId: string): Promise<IItemOptionsDocument | null>;
  findWithActiveItems(): Promise<IItemOptionsDocument[]>;
}
