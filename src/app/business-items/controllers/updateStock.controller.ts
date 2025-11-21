/**
 * Update Stock Controller
 * Handles HTTP requests for stock management with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import {
  updateStock,
  incrementStock,
  decrementStock,
  findLowStockItems,
} from '../services/updateStock.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Update item stock quantity
 * @route PATCH /api/business-items/:id/stock
 * @access Private
 *
 * @example
 * PATCH /api/business-items/123e4567-e89b-12d3-a456-426614174000/stock
 * Body: { "quantity": 100 }
 */
export const updateStockController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      throw new ValidationError(
        'Validation failed',
        'Quantity is required in request body'
      );
    }

    const result = await withTransaction(async (transaction) => {
      return await updateStock(id, quantity, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Increment item stock
 * @route PATCH /api/business-items/:id/stock/increment
 * @access Private
 *
 * @example
 * PATCH /api/business-items/123e4567-e89b-12d3-a456-426614174000/stock/increment
 * Body: { "increment": 50 }
 */
export const incrementStockController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { increment } = req.body;

    if (increment === undefined) {
      throw new ValidationError(
        'Validation failed',
        'Increment value is required in request body'
      );
    }

    const result = await withTransaction(async (transaction) => {
      return await incrementStock(id, increment, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Decrement item stock
 * @route PATCH /api/business-items/:id/stock/decrement
 * @access Private
 *
 * @example
 * PATCH /api/business-items/123e4567-e89b-12d3-a456-426614174000/stock/decrement
 * Body: { "decrement": 5 }
 */
export const decrementStockController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { decrement } = req.body;

    if (decrement === undefined) {
      throw new ValidationError(
        'Validation failed',
        'Decrement value is required in request body'
      );
    }

    const result = await withTransaction(async (transaction) => {
      return await decrementStock(id, decrement, { transaction });
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Find items with low stock
 * @route GET /api/business-items/low-stock
 * @access Private
 *
 * @example
 * GET /api/business-items/low-stock
 * GET /api/business-items/low-stock?businessId=uuid
 */
export const findLowStockItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId } = req.query;
    const result = await findLowStockItems(businessId as string | undefined);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
