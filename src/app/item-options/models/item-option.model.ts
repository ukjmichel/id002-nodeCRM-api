// src/models/item-option.model.ts
/**
 * =============================================================================
 * ItemOptionModel – Sequelize (sequelize-typescript)
 * =============================================================================
 * Junction table for relationship between Items (SQL) and OptionGroups (MongoDB).
 * Composite primary key: itemId + optionId
 *
 * Note: optionId references an OptionGroup document in MongoDB (Mongoose).
 * The relationship is managed at the application level, not database level.
 * =============================================================================
 */

import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { ItemModel } from '../../items/models/item.model';


// =========================================================================
// Interfaces
// =========================================================================

export interface ItemOptionAttributes {
  itemId: string;
  optionId: string;
  sortOrder: number;
  isRequired: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ItemOptionCreationAttributes
  extends Omit<ItemOptionAttributes, 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: 'item_options',
  timestamps: true,
  indexes: [
    { name: 'idx_item_options_item_id', fields: ['itemId'] },
    { name: 'idx_item_options_option_id', fields: ['optionId'] },
    { name: 'idx_item_options_sort_order', fields: ['itemId', 'sortOrder'] },
  ],
})
export class ItemOptionModel
  extends Model<ItemOptionAttributes, ItemOptionCreationAttributes>
  implements ItemOptionAttributes
{
  // =========================================================================
  // Composite Primary Key
  // =========================================================================

  @ForeignKey(() => ItemModel)
  @Index('idx_item_options_item_id')
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  declare itemId: string;

  @Index('idx_item_options_option_id')
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
    primaryKey: true,
    comment: 'MongoDB ObjectId reference to OptionGroup document',
  })
  declare optionId: string;

  // =========================================================================
  // Additional Fields
  // =========================================================================

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order of the option within the item',
  })
  declare sortOrder: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this option is required for the item',
  })
  declare isRequired: boolean;

  // =========================================================================
  // Associations (SQL only - ItemModel)
  // =========================================================================

  @BelongsTo(() => ItemModel)
  declare item: ItemModel;

  // =========================================================================
  // Timestamps
  // =========================================================================

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // =========================================================================
  // Instance Methods
  // =========================================================================

  toJSON() {
    const attributes = { ...this.get() } as Record<string, unknown>;
    return attributes;
  }
}
