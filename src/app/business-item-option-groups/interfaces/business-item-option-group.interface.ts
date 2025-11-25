// src/interfaces/business-item-option-group.interface.ts
/**
 * =============================================================================
 * BusinessItemOptionGroup Interface
 * =============================================================================
 * TypeScript interface for business item option groups
 * =============================================================================
 */

import { Document, Model } from 'mongoose';

/**
 * Base interface for BusinessItemOptionGroup
 */
export interface IBusinessItemOptionGroup {
  optionId: string;
  description: string;
  items: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface with document methods
 */
export interface IBusinessItemOptionGroupDocument
  extends IBusinessItemOptionGroup,
    Document {
  // Instance methods
  addItem(itemId: string): void;
  removeItem(itemId: string): void;
  hasItem(itemId: string): boolean;
  getItemCount(): number;
}

/**
 * Interface for static methods (Model methods)
 */
export interface IBusinessItemOptionGroupModel
  extends Model<IBusinessItemOptionGroupDocument> {
  findByItemId(itemId: string): Promise<IBusinessItemOptionGroupDocument[]>;
  findByOptionId(
    optionId: string
  ): Promise<IBusinessItemOptionGroupDocument | null>;
}
