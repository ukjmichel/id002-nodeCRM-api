/**
 * =============================================================================
 * Business Service - Main Export
 * =============================================================================
 * Combines all business service methods into a single service object.
 * Each method is implemented in its own file for better maintainability.
 * =============================================================================
 */

import {
  ApiResponse,
  FindOneOptions,
  ICrudService,
} from '../../../core/utils/crudServiceGenerator';
import {
  BusinessAttributes,
  BusinessSearchCriteria,
} from '../interfaces/business.interface';
import { BusinessModel } from '../models/business.model';
import { activateBusiness } from './activateBusiness';
import { bulkCreateBusinesses } from './bulkCreateBusinesses';
import { countBusinesses } from './countBusinesses';

import { createBusiness } from './createBusiness';
import { deactivateBusiness } from './deactivateBusiness';
import { deleteBusiness } from './deleteBusiness';
import { findActiveBusinesses } from './findActiveBusinesses';

import { findAllBusinesses } from './findAllBusinesses';
import { findBusinessById } from './findBusinessById';

import { findBusinessesBySiren } from './findBusinessesBySiren';
import { findBusinessesByLegalForm } from './findBusinessesByLegalForm';
import { findBusinessesByUserId } from './findBusinessesByUserId';
import { findInactiveBusinesses } from './findInactiveBusinesses';

import { findOneBusiness } from './findOneBusiness';
import { searchBusinesses } from './searchBusinesses';

import { updateBusiness } from './updateBusiness';
import { findBusinessBySiret } from './findBusinessBySiret';

/**
 * Extended Business Service Interface
 * Includes standard CRUD operations plus business-specific methods
 */
export interface IBusinessService extends ICrudService<BusinessModel> {
  findBySiret(
    siret: string,
    options?: FindOneOptions
  ): Promise<ApiResponse<BusinessModel>>;
  findBySiren(siren: string): Promise<ApiResponse<BusinessModel[]>>;
  findByUserId(userId: string): Promise<ApiResponse<BusinessModel[]>>;
  findByLegalForm(legalForm: string): Promise<ApiResponse<BusinessModel[]>>;
  findActiveBusinesses(): Promise<ApiResponse<BusinessModel[]>>;
  findInactiveBusinesses(): Promise<ApiResponse<BusinessModel[]>>;
  activateBusiness(businessId: string): Promise<ApiResponse<BusinessModel>>;
  deactivateBusiness(
    businessId: string,
    closureDate?: Date
  ): Promise<ApiResponse<BusinessModel>>;
  searchBusinesses(
    criteria: BusinessSearchCriteria
  ): Promise<ApiResponse<BusinessModel[]>>;
}

/**
 * Business Service
 * Provides all CRUD operations and business-specific business logic
 *
 * @example
 * ```typescript
 * import { businessService } from './services/business';
 *
 * // Create a new business
 * const newBusiness = await businessService.create({
 *   userId: 'user-uuid',
 *   siret: '12345678901234',
 *   siren: '123456789',
 *   legalName: 'ACME Corporation',
 *   legalForm: 'SARL',
 *   addressLine1: '123 Rue de la Paix',
 *   postalCode: '75001',
 *   city: 'Paris',
 *   country: 'FR'
 * });
 *
 * // Find business by SIRET
 * const business = await businessService.findBySiret('12345678901234');
 *
 * // Get all businesses for a user
 * const userBusinesses = await businessService.findByUserId('user-uuid');
 *
 * // Search businesses
 * const results = await businessService.searchBusinesses({
 *   query: 'ACME',
 *   legalForm: ['SARL', 'SAS'],
 *   active: true
 * });
 *
 * // Deactivate a business
 * await businessService.deactivateBusiness('business-uuid');
 * ```
 */
export const businessService: IBusinessService = {
  // CRUD Operations
  create: createBusiness,
  findAll: findAllBusinesses,
  findById: findBusinessById,
  findOne: findOneBusiness,
  update: updateBusiness,
  delete: deleteBusiness,
  bulkCreate: bulkCreateBusinesses,
  count: countBusinesses,

  // Business-specific Operations
  findBySiret: findBusinessBySiret,
  findBySiren: findBusinessesBySiren,
  findByUserId: findBusinessesByUserId,
  findByLegalForm: findBusinessesByLegalForm,
  findActiveBusinesses: findActiveBusinesses,
  findInactiveBusinesses: findInactiveBusinesses,
  activateBusiness: activateBusiness,
  deactivateBusiness: deactivateBusiness,
  searchBusinesses: searchBusinesses,
};

export default businessService;

// Re-export individual methods for direct imports if needed
export {
  // CRUD
  createBusiness,
  findAllBusinesses,
  findBusinessById,
  findOneBusiness,
  updateBusiness,
  deleteBusiness,
  bulkCreateBusinesses,
  countBusinesses,
  // Business-specific
  findBusinessBySiret,
  findBusinessesBySiren,
  findBusinessesByUserId,
  findBusinessesByLegalForm,
  findActiveBusinesses,
  findInactiveBusinesses,
  activateBusiness,
  deactivateBusiness,
  searchBusinesses,
};
