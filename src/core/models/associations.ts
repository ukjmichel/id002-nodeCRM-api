// src/models/associations.ts
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../../app/users/models/user.model.js';
import { RoleModel } from '../../app/authorisation/models/role.model.js';
import { BusinessModel } from '../../app/businesses/models/business.model.js';
import { BusinessItemModel } from '../../app/business-items/models/business-item.model.js';

// Core domain models

/**
 * Register models + define associations exactly once.
 * IMPORTANT:
 *  - Do not also pass `models: []` to new Sequelize if you call this.
 *  - Remove any @HasMany/@BelongsTo decorators from model classes that
 *    duplicate what we define here (to avoid alias collisions).
 */
export function registerAssociations(sequelize: Sequelize) {
  // 1) Register all models used by the app
  sequelize.addModels([UserModel, RoleModel, BusinessModel,BusinessItemModel]);

  // 2) Define associations

  // User <-> Role (one-to-one relationship)
  UserModel.hasOne(RoleModel, {
    foreignKey: 'userId',
    as: 'role',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  RoleModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // User <-> Business (one-to-many relationship)
  // One user can own multiple businesses
  UserModel.hasMany(BusinessModel, {
    foreignKey: 'userId',
    as: 'businesses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  BusinessModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  BusinessModel.hasMany(BusinessItemModel, {
    foreignKey: 'businessId',
    as: 'businessesItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  
}
