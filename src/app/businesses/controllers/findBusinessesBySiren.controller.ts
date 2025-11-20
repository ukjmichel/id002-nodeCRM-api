/**
 * Find Businesses By SIREN Controller
 * Handles HTTP request for retrieving businesses by SIREN number
 */

import { Request, Response, NextFunction } from 'express';
import { findBusinessesBySiren } from '../services/findBusinessesBySiren.js';

/**
 * Get all businesses with the same SIREN
 * @route GET /api/businesses/siren/:siren
 */
export const findBusinessesBySirenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { siren } = req.params;
    const result = await findBusinessesBySiren(siren);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
