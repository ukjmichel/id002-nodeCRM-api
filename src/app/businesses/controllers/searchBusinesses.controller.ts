/**
 * Search Businesses Controller
 * Handles HTTP request for searching businesses with advanced criteria
 */

import { Request, Response, NextFunction } from 'express';
import { searchBusinesses } from '../services/searchBusinesses.js';
import { BusinessSearchCriteria } from '../interfaces/business.interface.js';

/**
 * Search businesses with advanced criteria
 * @route POST /api/businesses/search
 */
export const searchBusinessesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const criteria: BusinessSearchCriteria = req.body;
    
    // Parse date strings if provided
    if (criteria.registeredAfter && typeof criteria.registeredAfter === 'string') {
      criteria.registeredAfter = new Date(criteria.registeredAfter);
    }
    if (criteria.registeredBefore && typeof criteria.registeredBefore === 'string') {
      criteria.registeredBefore = new Date(criteria.registeredBefore);
    }
    
    const result = await searchBusinesses(criteria);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
