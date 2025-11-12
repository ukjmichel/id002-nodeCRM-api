// src/models/associations.ts
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from '../../app/users/models/user.model.js';

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
  sequelize.addModels([UserModel]);
}
