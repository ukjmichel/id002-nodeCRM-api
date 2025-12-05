// src/interfaces/item-option.interface.ts
/**
 * =============================================================================
 * ItemOption Interface
 * =============================================================================
 * TypeScript interfaces for the ItemOption junction table
 * Manages relationship between Items (SQL) and OptionGroups (MongoDB)
 * =============================================================================
 */

/**
 * Base attributes for ItemOption
 */
export interface ItemOptionAttributes {
  itemId: string;
  optionId: string;
  sortOrder: number;
  isRequired: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Attributes for creating a new ItemOption
 */
export interface ItemOptionCreationAttributes
  extends Omit<ItemOptionAttributes, 'createdAt' | 'updatedAt'> {}

/**
 * Input for adding an option to an item
 */
export interface AddOptionToItemInput {
  itemId: string;
  optionId: string;
  sortOrder?: number;
  isRequired?: boolean;
}

/**
 * Input for bulk adding options to an item
 */
export interface BulkAddOptionsToItemInput {
  itemId: string;
  options: {
    optionId: string;
    sortOrder?: number;
    isRequired?: boolean;
  }[];
}

/**
 * Input for updating an item-option relationship
 */
export interface UpdateItemOptionInput {
  sortOrder?: number;
  isRequired?: boolean;
}

/**
 * Input for bulk updating item-option relationships
 */
export interface BulkUpdateItemOptionsInput {
  itemId: string;
  updates: {
    optionId: string;
    sortOrder?: number;
    isRequired?: boolean;
  }[];
}

/**
 * Input for replacing all options for an item
 */
export interface ReplaceItemOptionsInput {
  itemId: string;
  options: {
    optionId: string;
    sortOrder?: number;
    isRequired?: boolean;
  }[];
}

/**
 * Query options for finding item-options
 */
export interface ItemOptionQueryOptions {
  itemId?: string;
  optionId?: string;
  isRequired?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'sortOrder' | 'createdAt' | 'updatedAt';
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Result of item-option operations with counts
 */
export interface ItemOptionOperationResult {
  success: boolean;
  message: string;
  affectedCount?: number;
}

/**
 * Extended item-option with optional populated data
 */
export interface ItemOptionWithDetails extends ItemOptionAttributes {
  item?: {
    id: string;
    name: string;
    sku?: string;
  };
  optionGroup?: {
    optionId: string;
    description: string;
  };
}
