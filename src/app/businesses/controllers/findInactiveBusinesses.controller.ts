/**
 * Find Inactive Businesses Controller
 * Handles HTTP request for retrieving inactive businesses
 */

import { Request, Response, NextFunction } from 'express';
import { findInactiveBusinesses } from '../services/findInactiveBusinesses.js';

/**
 * Get all inactive businesses
 * @route GET /api/businesses/inactive
 */
export const findInactiveBusinessesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await findInactiveBusinesses();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
