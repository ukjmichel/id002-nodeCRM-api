/**
 * Create Business Controller
 * Handles HTTP request for creating a new business with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { createBusiness } from '../services/createBusiness.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Create a new business
 * @route POST /api/businesses
 * @access Private
 *
 * @example
 * POST /api/businesses
 * Body: {
 *   "userId": "user-uuid",
 *   "siret": "12345678901234",
 *   "siren": "123456789",
 *   "legalName": "ACME Corporation",
 *   "legalForm": "SARL",
 *   "addressLine1": "123 Rue de la Paix",
 *   "postalCode": "75001",
 *   "city": "Paris",
 *   "country": "FR"
 * }
 */
export const createBusinessController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    // Perform creation within a transaction for data integrity
    const result = await withTransaction(async (transaction) => {
      return await createBusiness(req.body, { transaction });
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
