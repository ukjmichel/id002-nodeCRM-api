/**
 * Search Businesses Service
 * Advanced search for businesses with multiple criteria and validation
 */

import { Op } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { BusinessSearchCriteria } from '../interfaces/business.interface.js';
import { BusinessModel } from '../models/business.model.js';
import { findAllBusinesses } from './findAllBusinesses.js';

/**
 * Search businesses with advanced criteria
 *
 * @param criteria - Search criteria
 * @returns Array of matching businesses
 * @throws {ValidationError} When search fails
 *
 * @example
 * ```typescript
 * const results = await searchBusinesses({
 *   query: 'ACME',
 *   legalForm: ['SARL', 'SAS'],
 *   department: ['75', '92'],
 *   active: true,
 *   minCapital: 10000
 * });
 * ```
 */
export const searchBusinesses = async (
  criteria: BusinessSearchCriteria
): Promise<ApiResponse<BusinessModel[]>> => {
  try {
    // ========================================================================
    // PRE-DATABASE VALIDATION
    // ========================================================================

    // Validate criteria object
    if (!criteria || typeof criteria !== 'object') {
      throw new ValidationError(
        'Validation failed',
        'Search criteria must be an object'
      );
    }

    // Validate query length if provided
    if (criteria.query && criteria.query.length > 200) {
      throw new ValidationError(
        'Validation failed',
        'Search query must not exceed 200 characters'
      );
    }

    // Validate legal forms if provided
    if (criteria.legalForm) {
      if (!Array.isArray(criteria.legalForm)) {
        throw new ValidationError(
          'Validation failed',
          'Legal form must be an array'
        );
      }

      const validLegalForms = [
        'SARL',
        'EURL',
        'SAS',
        'SASU',
        'SA',
        'SNC',
        'SCS',
        'SCA',
        'EI',
        'EIRL',
        'Auto-entrepreneur',
        'Micro-entreprise',
        'Association',
        'SCI',
        'SCOP',
        'GIE',
        'Other',
      ];

      const invalidForms = criteria.legalForm.filter(
        (form) => !validLegalForms.includes(form)
      );

      if (invalidForms.length > 0) {
        throw new ValidationError(
          'Validation failed',
          `Invalid legal forms: ${invalidForms.join(', ')}`
        );
      }
    }

    // Validate departments if provided
    if (criteria.department) {
      if (!Array.isArray(criteria.department)) {
        throw new ValidationError(
          'Validation failed',
          'Department must be an array'
        );
      }

      criteria.department.forEach((dept) => {
        if (!/^[0-9]{2}[AB]?$/.test(dept)) {
          throw new ValidationError(
            'Validation failed',
            `Invalid department code: ${dept}. Must be 2 digits optionally followed by A or B`
          );
        }
      });
    }

    // Validate regions if provided
    if (criteria.region) {
      if (!Array.isArray(criteria.region)) {
        throw new ValidationError(
          'Validation failed',
          'Region must be an array'
        );
      }
    }

    // Validate capital range
    if (criteria.minCapital !== undefined && criteria.minCapital < 0) {
      throw new ValidationError(
        'Validation failed',
        'Minimum capital must be a positive number'
      );
    }

    if (criteria.maxCapital !== undefined && criteria.maxCapital < 0) {
      throw new ValidationError(
        'Validation failed',
        'Maximum capital must be a positive number'
      );
    }

    if (
      criteria.minCapital !== undefined &&
      criteria.maxCapital !== undefined &&
      criteria.minCapital > criteria.maxCapital
    ) {
      throw new ValidationError(
        'Validation failed',
        'Minimum capital cannot be greater than maximum capital'
      );
    }

    // Validate registration dates
    if (criteria.registeredAfter && criteria.registeredBefore) {
      const afterDate = new Date(criteria.registeredAfter);
      const beforeDate = new Date(criteria.registeredBefore);

      if (isNaN(afterDate.getTime()) || isNaN(beforeDate.getTime())) {
        throw new ValidationError(
          'Validation failed',
          'Invalid date format for registration dates'
        );
      }

      if (afterDate > beforeDate) {
        throw new ValidationError(
          'Validation failed',
          'Registration "after" date cannot be later than "before" date'
        );
      }
    }

    // ========================================================================
    // DATABASE OPERATION
    // ========================================================================

    const where: any = {};

    // Text search in legal name, trade name, SIRET, SIREN
    if (criteria.query) {
      const searchTerm = criteria.query.trim();
      where[Op.or] = [
        { legalName: { [Op.like]: `%${searchTerm}%` } },
        { tradeName: { [Op.like]: `%${searchTerm}%` } },
        { siret: { [Op.like]: `%${searchTerm}%` } },
        { siren: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    // Legal form filter
    if (criteria.legalForm && criteria.legalForm.length > 0) {
      where.legalForm = { [Op.in]: criteria.legalForm };
    }

    // Department filter
    if (criteria.department && criteria.department.length > 0) {
      where.department = { [Op.in]: criteria.department };
    }

    // Region filter
    if (criteria.region && criteria.region.length > 0) {
      where.region = { [Op.in]: criteria.region };
    }

    // Active status filter
    if (criteria.active !== undefined) {
      where.active = criteria.active;
    }

    // VAT exempt filter
    if (criteria.vatExempt !== undefined) {
      where.vatExempt = criteria.vatExempt;
    }

    // Capital range filter
    if (
      criteria.minCapital !== undefined ||
      criteria.maxCapital !== undefined
    ) {
      where.capital = {};
      if (criteria.minCapital !== undefined) {
        where.capital[Op.gte] = criteria.minCapital;
      }
      if (criteria.maxCapital !== undefined) {
        where.capital[Op.lte] = criteria.maxCapital;
      }
    }

    // Registration date range filter
    if (
      criteria.registeredAfter !== undefined ||
      criteria.registeredBefore !== undefined
    ) {
      where.registrationDate = {};
      if (criteria.registeredAfter !== undefined) {
        where.registrationDate[Op.gte] = criteria.registeredAfter;
      }
      if (criteria.registeredBefore !== undefined) {
        where.registrationDate[Op.lte] = criteria.registeredBefore;
      }
    }

    // Has RCS registration filter
    if (criteria.hasRCS !== undefined) {
      if (criteria.hasRCS) {
        where[Op.and] = [
          { rcsNumber: { [Op.not]: null } },
          { rcsCity: { [Op.not]: null } },
        ];
      } else {
        where[Op.or] = [{ rcsNumber: null }, { rcsCity: null }];
      }
    }

    // Has VAT number filter
    if (criteria.hasVAT !== undefined) {
      if (criteria.hasVAT) {
        where.vatNumber = { [Op.not]: null };
      } else {
        where.vatNumber = null;
      }
    }

    const result = await findAllBusinesses({
      where,
      order: [['createdAt', 'DESC']],
    });

    return {
      ...result,
      message:
        result.count === 0
          ? 'No businesses found matching the search criteria'
          : `Found ${result.count} business(es) matching the search criteria`,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      'Error searching businesses',
      error instanceof Error ? error.message : String(error)
    );
  }
};
