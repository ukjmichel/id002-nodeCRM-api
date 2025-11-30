/**
 * Set Item Availability Controller
 * Handles HTTP request for updating item availability with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import {
  setItemAvailability,
  makeItemAvailable,
  makeItemUnavailable,
} from '../services/setItemAvailability.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Set item availability status
 * @route PATCH /api/items/:id/availability
 * @access Private
 *
 * @example
 * PATCH /api/items/123e4567-e89b-12d3-a456-426614174000/availability
 * Body: { "available": false }
 */
export const setItemAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    if (available === undefined) {
      throw new ValidationError(
        'Validation failed',
        'Available field is required in request body'
      );
    }

    // Perform update within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await setItemAvailability(id, available, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Make an item available
 * @route PATCH /api/items/:id/make-available
 * @access Private
 *
 * @example
 * PATCH /api/items/123e4567-e89b-12d3-a456-426614174000/make-available
 */
export const makeItemAvailableController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await withTransaction(async (transaction) => {
      return await makeItemAvailable(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Make an item unavailable
 * @route PATCH /api/items/:id/make-unavailable
 * @access Private
 *
 * @example
 * PATCH /api/items/123e4567-e89b-12d3-a456-426614174000/make-unavailable
 */
export const makeItemUnavailableController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await withTransaction(async (transaction) => {
      return await makeItemUnavailable(id, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
