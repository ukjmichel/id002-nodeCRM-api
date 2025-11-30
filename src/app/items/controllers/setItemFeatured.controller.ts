/**
 * Set Item Featured Controller
 * Handles HTTP request for updating item featured status with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import {
  setItemFeatured,
  featureItem,
  unfeatureItem,
} from '../services/setItemFeatured.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Set item featured status
 * @route PATCH /api/items/:id/featured
 * @access Private
 *
 * @example
 * PATCH /api/items/123e4567-e89b-12d3-a456-426614174000/featured
 * Body: { "featured": true }
 */
export const setItemFeaturedController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (featured === undefined) {
      throw new ValidationError(
        'Validation failed',
        'Featured field is required in request body'
      );
    }

    // Perform update within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await setItemFeatured(id, featured, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Feature an item
 * @route PATCH /api/items/:id/feature
 * @access Private
 *
 * @example
 * PATCH /api/items/123e4567-e89b-12d3-a456-426614174000/feature
 */
export const featureItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await withTransaction(async (transaction) => {
      return await featureItem(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Unfeature an item
 * @route PATCH /api/items/:id/unfeature
 * @access Private
 *
 * @example
 * PATCH /api/items/123e4567-e89b-12d3-a456-426614174000/unfeature
 */
export const unfeatureItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await withTransaction(async (transaction) => {
      return await unfeatureItem(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
