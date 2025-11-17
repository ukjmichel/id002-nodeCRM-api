// src/models/role.model.ts
/**
 * =============================================================================
 * RoleModel — Sequelize (sequelize-typescript)
 * =============================================================================
 * Manages user roles with a foreign key relationship to UserModel.
 * Supported roles: administrator, staff, customer, business, delivery
 * Ensures one role per user (userId is primary key).
 * =============================================================================
 */

import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';

import { UserModel } from '../../users/models/user.model.js';
import {
  RoleAttributes,
  RoleCreationAttributes,
} from '../interfaces/role.interface.js';

export enum RoleType {
  ADMINISTRATOR = 'administrator',
  STAFF = 'staff',
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  DELIVERY = 'delivery',
}

@Table({
  tableName: 'roles',
  timestamps: true,
  indexes: [{ name: 'idx_roles_role_type', fields: ['roleType'] }],
})
export class RoleModel
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  declare userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(RoleType)),
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(RoleType)],
        msg: `Role type must be one of: ${Object.values(RoleType).join(', ')}`,
      },
    },
  })
  declare roleType: RoleType;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  @BeforeCreate
  @BeforeUpdate
  static normalizeFields(instance: RoleModel) {
    if (
      instance.changed('description') &&
      typeof instance.description === 'string'
    ) {
      instance.description = instance.description.trim() || null;
    }
  }

  /**
   * Check if role has administrative privileges
   */
  isAdministrator(): boolean {
    return this.roleType === RoleType.ADMINISTRATOR && this.isActive;
  }

  /**
   * Check if role has staff privileges
   */
  isStaff(): boolean {
    return this.roleType === RoleType.STAFF && this.isActive;
  }

  /**
   * Check if role is customer
   */
  isCustomer(): boolean {
    return this.roleType === RoleType.CUSTOMER && this.isActive;
  }

  /**
   * Check if role is business
   */
  isBusiness(): boolean {
    return this.roleType === RoleType.BUSINESS && this.isActive;
  }

  /**
   * Check if role is delivery
   */
  isDelivery(): boolean {
    return this.roleType === RoleType.DELIVERY && this.isActive;
  }

  /**
   * Check if role has elevated privileges (administrator or staff)
   */
  hasElevatedPrivileges(): boolean {
    return (
      this.isActive &&
      (this.roleType === RoleType.ADMINISTRATOR ||
        this.roleType === RoleType.STAFF)
    );
  }

  toJSON() {
    const attributes = { ...this.get() } as Record<string, unknown>;
    return attributes;
  }
}
