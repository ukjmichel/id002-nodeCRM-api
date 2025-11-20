// src/app/businesses/routes/business.routes.ts
/**
 * Business Routes
 * Defines all API endpoints for business management
 *
 * IMPORTANT: Route order matters!
 * - Specific routes (e.g., /bulk, /search, /active) MUST come BEFORE dynamic routes (e.g., /:id)
 * - Otherwise Express will match /search as /:id with id="search"
 */

import { Router } from 'express';
import {
  createBusinessController,
  findAllBusinessesController,
  findBusinessByIdController,
  updateBusinessController,
  deleteBusinessController,
  bulkCreateBusinessesController,
  countBusinessesController,
  findBusinessBySiretController,
  findBusinessesBySirenController,
  findBusinessesByUserIdController,
  findBusinessesByLegalFormController,
  findActiveBusinessesController,
  findInactiveBusinessesController,
  activateBusinessController,
  deactivateBusinessController,
  searchBusinessesController,
} from '../controllers/index.js';
import {
  createBusinessValidator,
  updateBusinessValidator,
  businessIdValidator,
  bulkCreateBusinessesValidator,
  queryParamsValidator,
  siretValidator,
  sirenValidator,
  userIdValidator,
  legalFormValidator,
  deactivateBusinessValidator,
  searchBusinessesValidator,
} from '../validators/index.js';

const router = Router();

// ============================================================================
// POST ROUTES - Specific routes first
// ============================================================================

/**
 * @route   POST /api/businesses
 * @desc    Create a new business
 * @access  Private (Authenticated users)
 */
router.post('/', createBusinessValidator, createBusinessController);

/**
 * @route   POST /api/businesses/bulk
 * @desc    Bulk create businesses
 * @access  Private (Admin only)
 * @note    Must come BEFORE /:id routes
 */
router.post(
  '/bulk',
  bulkCreateBusinessesValidator,
  bulkCreateBusinessesController
);

/**
 * @route   POST /api/businesses/search
 * @desc    Search businesses with advanced criteria
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.post('/search', searchBusinessesValidator, searchBusinessesController);

// ============================================================================
// GET ROUTES - Specific routes first, then dynamic routes
// ============================================================================

/**
 * @route   GET /api/businesses/count
 * @desc    Count businesses with optional filters
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.get('/count', queryParamsValidator, countBusinessesController);

/**
 * @route   GET /api/businesses/active
 * @desc    Get all active businesses
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.get('/active', findActiveBusinessesController);

/**
 * @route   GET /api/businesses/inactive
 * @desc    Get all inactive businesses
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.get('/inactive', findInactiveBusinessesController);

/**
 * @route   GET /api/businesses/siret/:siret
 * @desc    Get a business by SIRET number
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.get('/siret/:siret', siretValidator, findBusinessBySiretController);

/**
 * @route   GET /api/businesses/siren/:siren
 * @desc    Get all businesses with the same SIREN
 * @access  Private
 * @note    Must come BEFORE /:id routes
 */
router.get('/siren/:siren', sirenValidator, findBusinessesBySirenController);

/**
 * @route   GET /api/businesses/user/:userId
 * @desc    Get all businesses owned by a user
 * @access  Private (User or Admin)
 * @note    Must come BEFORE generic /:id routes
 */
router.get('/user/:userId', userIdValidator, findBusinessesByUserIdController);

/**
 * @route   GET /api/businesses/legal-form/:legalForm
 * @desc    Get all businesses with a specific legal form
 * @access  Private
 * @note    Must come BEFORE generic /:id routes
 */
router.get(
  '/legal-form/:legalForm',
  legalFormValidator,
  findBusinessesByLegalFormController
);

/**
 * @route   GET /api/businesses
 * @desc    Get all businesses with optional filters and pagination
 * @access  Private
 */
router.get('/', queryParamsValidator, findAllBusinessesController);

/**
 * @route   GET /api/businesses/:id
 * @desc    Get a single business by ID
 * @access  Private
 * @note    Generic /:id route - comes AFTER all specific routes
 */
router.get('/:id', businessIdValidator, findBusinessByIdController);

// ============================================================================
// PATCH ROUTES - Specific :id sub-routes first, then generic /:id
// ============================================================================

/**
 * @route   PATCH /api/businesses/:id/activate
 * @desc    Activate a business
 * @access  Private (Business owner or Admin)
 * @note    Must come BEFORE generic /:id route
 */
router.patch('/:id/activate', businessIdValidator, activateBusinessController);

/**
 * @route   PATCH /api/businesses/:id/deactivate
 * @desc    Deactivate a business
 * @access  Private (Business owner or Admin)
 * @note    Must come BEFORE generic /:id route
 */
router.patch(
  '/:id/deactivate',
  deactivateBusinessValidator,
  deactivateBusinessController
);

/**
 * @route   PATCH /api/businesses/:id
 * @desc    Update a business by ID
 * @access  Private (Business owner or Admin)
 * @note    Generic /:id route - comes AFTER specific :id sub-routes
 */
router.patch('/:id', updateBusinessValidator, updateBusinessController);

// ============================================================================
// DELETE ROUTES
// ============================================================================

/**
 * @route   DELETE /api/businesses/:id
 * @desc    Delete a business by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', businessIdValidator, deleteBusinessController);

export default router;
