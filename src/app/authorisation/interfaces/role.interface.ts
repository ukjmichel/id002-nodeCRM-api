// src/interfaces/role.interface.ts
/**
 * =============================================================================
 * Role Interfaces
 * =============================================================================
 * TypeScript interfaces for Role model attributes and creation
 * One role per user (userId is the primary key)
 * =============================================================================
 */

import { RoleType } from '../models/role.model';

/**
 * Complete Role attributes (database representation)
 */
export interface RoleAttributes {
  userId: string;
  roleType: RoleType;
  isActive: boolean;
  description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Attributes required for creating a new Role
 */
export interface RoleCreationAttributes {
  userId: string;
  roleType: RoleType;
  isActive?: boolean;
  description?: string | null;
}

/**
 * Attributes for updating a Role
 */
export interface RoleUpdateAttributes {
  roleType?: RoleType;
  isActive?: boolean;
  description?: string | null;
}

/**
 * Role response DTO (Data Transfer Object)
 */
export interface RoleDTO {
  userId: string;
  roleType: RoleType;
  isActive: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
