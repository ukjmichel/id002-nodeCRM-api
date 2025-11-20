// src/app/roles/routes/role.routes.ts
/**
 * Role Routes
 * Defines all API endpoints for role management
 */

import { Router } from 'express';
import {
  createRoleController,
  findAllRolesController,
  findRoleByUserIdController,
  updateRoleController,
  deleteRoleController,
  bulkCreateRolesController,
  countRolesController,
  findRolesByTypeController,
  findActiveRolesController,
  activateRoleController,
  deactivateRoleController,
} from '../controllers/index.js';
import { bulkCreateRolesValidator, createRoleValidator, roleTypeValidator, updateRoleValidator } from '../validators/index.js';
import { queryParamsValidator, userIdValidator } from '../../users/validators/index.js';


const router = Router();

/**
 * @route   POST /api/roles
 * @desc    Create a new role
 * @access  Private (Admin only)
 */
router.post('/', createRoleValidator, createRoleController);

/**
 * @route   POST /api/roles/bulk
 * @desc    Bulk create roles
 * @access  Private (Admin only)
 */
router.post('/bulk', bulkCreateRolesValidator, bulkCreateRolesController);

/**
 * @route   GET /api/roles/count
 * @desc    Count roles with optional filters
 * @access  Private
 */
router.get('/count', queryParamsValidator, countRolesController);

/**
 * @route   GET /api/roles/active
 * @desc    Get all active roles
 * @access  Private
 */
router.get('/active', findActiveRolesController);

/**
 * @route   GET /api/roles/type/:roleType
 * @desc    Get all roles of a specific type
 * @access  Private
 */
router.get('/type/:roleType', roleTypeValidator, findRolesByTypeController);

/**
 * @route   GET /api/roles
 * @desc    Get all roles with optional filters and pagination
 * @access  Private
 */
router.get('/', queryParamsValidator, findAllRolesController);

/**
 * @route   GET /api/roles/user/:userId
 * @desc    Get a role by user ID
 * @access  Private
 */
router.get('/user/:userId', userIdValidator, findRoleByUserIdController);

/**
 * @route   PUT /api/roles/:userId
 * @desc    Update a role by user ID
 * @access  Private (Admin only)
 */
router.patch('/:userId', updateRoleValidator, updateRoleController);

/**
 * @route   PATCH /api/roles/:userId/activate
 * @desc    Activate a role
 * @access  Private (Admin only)
 */
router.patch('/:userId/activate', userIdValidator, activateRoleController);

/**
 * @route   PATCH /api/roles/:userId/deactivate
 * @desc    Deactivate a role
 * @access  Private (Admin only)
 */
router.patch('/:userId/deactivate', userIdValidator, deactivateRoleController);

/**
 * @route   DELETE /api/roles/:userId
 * @desc    Delete a role by user ID
 * @access  Private (Admin only)
 */
router.delete('/:userId', userIdValidator, deleteRoleController);

export default router;
