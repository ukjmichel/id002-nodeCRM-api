/**
 * Find Active Businesses Controller
 * Handles HTTP request for retrieving active businesses
 */

import { Request, Response, NextFunction } from 'express';
import { findActiveBusinesses } from '../services/findActiveBusinesses.js';

/**
 * Get all active businesses
 * @route GET /api/businesses/active
 */
export const findActiveBusinessesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await findActiveBusinesses();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
