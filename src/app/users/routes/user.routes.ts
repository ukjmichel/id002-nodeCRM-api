// src/app/users/routes/user.routes.ts
/**
 * User Routes
 * Defines all API endpoints for user management
 */

import { Router } from 'express';
import {
  createUserController,
  findAllUsersController,
  findUserByIdController,
  updateUserController,
  deleteUserController,
  bulkCreateUsersController,
  countUsersController,
  validateUserPasswordController,
  updatePasswordController,
  verifyUserController,
  unverifyUserController,
} from '../controllers/index.js';
import {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
  bulkCreateUsersValidator,
  validatePasswordValidator,
  queryParamsValidator,
  updatePasswordValidator,
} from '../validators/index.js';

const router = Router();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public/Private (depends on your auth strategy)
 */
router.post('/', createUserValidator, createUserController);

/**
 * @route   POST /api/users/bulk
 * @desc    Bulk create users
 * @access  Private (Admin only)
 */
router.post('/bulk', bulkCreateUsersValidator, bulkCreateUsersController);

/**
 * @route   GET /api/users/count
 * @desc    Count users with optional filters
 * @access  Private
 */
router.get('/count', queryParamsValidator, countUsersController);

/**
 * @route   GET /api/users
 * @desc    Get all users with optional filters and pagination
 * @access  Private
 */
router.get('/', queryParamsValidator, findAllUsersController);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Private
 */
router.get('/:id', userIdValidator, findUserByIdController);

/**
 * @route   PATCH /api/users/:id
 * @desc    Update a user by ID (profile info only, not password or verified)
 * @access  Private (User or Admin)
 */
router.patch('/:id', updateUserValidator, updateUserController);

/**
 * @route   PATCH /api/users/:id/password
 * @desc    Update a user's password
 * @access  Private (User or Admin)
 */
router.patch(
  '/:id/password',
  updatePasswordValidator,
  updatePasswordController
);

/**
 * @route   PATCH /api/users/:id/verify
 * @desc    Verify a user account
 * @access  Private (Admin only or verification token)
 */
router.patch('/:id/verify', userIdValidator, verifyUserController);

/**
 * @route   PATCH /api/users/:id/unverify
 * @desc    Unverify a user account
 * @access  Private (Admin only)
 */
router.patch('/:id/unverify', userIdValidator, unverifyUserController);

/**
 * @route   POST /api/users/:id/validate-password
 * @desc    Validate a user's password
 * @access  Private (User or Admin)
 */
router.post(
  '/:id/validate-password',
  validatePasswordValidator,
  validateUserPasswordController
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', userIdValidator, deleteUserController);

export default router;
