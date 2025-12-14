// src/interfaces/option-group.interface.ts
/**
 * =============================================================================
 * OptionGroup Interface
 * =============================================================================
 * TypeScript interface for option groups
 * =============================================================================
 */

import { Document, Model } from 'mongoose';

/**
 * Interface for individual item within an option group
 */
export interface IOptionGroupItem {
  itemId: string;
  maxQuantity: number;
  active: boolean;
}

/**
 * Base interface for OptionGroup
 */
export interface IOptionGroup {
  optionId: string;
  description: string;
  items: IOptionGroupItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface with document methods
 */
export interface IOptionGroupDocument extends IOptionGroup, Document {
  // Instance methods
  addItem(itemId: string, maxQuantity?: number, active?: boolean): void;
  removeItem(itemId: string): void;
  hasItem(itemId: string): boolean;
  getItem(itemId: string): IOptionGroupItem | undefined;
  updateMaxQuantity(itemId: string, maxQuantity: number): boolean;
  setItemActive(itemId: string, active: boolean): boolean;
  getItemCount(): number;
  getActiveItemCount(): number;
  getActiveItems(): IOptionGroupItem[];
  getItemIds(): string[];
}

/**
 * Interface for static methods (Model methods)
 */
export interface IOptionGroupModel extends Model<IOptionGroupDocument> {
  findByItemId(itemId: string): Promise<IOptionGroupDocument[]>;
  findByActiveItemId(itemId: string): Promise<IOptionGroupDocument[]>;
  findByOptionId(optionId: string): Promise<IOptionGroupDocument | null>;
  findWithActiveItems(): Promise<IOptionGroupDocument[]>;
}

/**
 * Input for creating a new option group
 */
export interface CreateOptionGroupInput {
  optionId: string;
  description: string;
  items?: IOptionGroupItem[];
}

/**
 * Input for updating an option group
 */
export interface UpdateOptionGroupInput {
  description?: string;
  items?: IOptionGroupItem[];
}

/**
 * Input for adding an item to an option group
 */
export interface AddItemToOptionGroupInput {
  itemId: string;
  maxQuantity?: number;
  active?: boolean;
}
