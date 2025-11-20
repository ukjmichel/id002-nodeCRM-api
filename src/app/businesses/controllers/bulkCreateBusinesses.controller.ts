/**
 * Bulk Create Businesses Controller
 * Handles HTTP request for creating multiple businesses with transaction support
 */

import { Request, Response, NextFunction } from 'express';
import { bulkCreateBusinesses } from '../services/bulkCreateBusinesses.js';
import { ValidationError } from '../../../core/errors/index.js';
import { withTransaction } from '../../../core/utils/tx.js';

/**
 * Bulk create businesses
 * @route POST /api/businesses/bulk
 * @access Private
 *
 * @example
 * POST /api/businesses/bulk
 * Body: {
 *   "businesses": [
 *     {
 *       "userId": "user-uuid-1",
 *       "siret": "12345678901234",
 *       "siren": "123456789",
 *       "legalName": "ACME Corporation",
 *       "legalForm": "SARL",
 *       "addressLine1": "123 Rue de la Paix",
 *       "postalCode": "75001",
 *       "city": "Paris",
 *       "country": "FR"
 *     },
 *     {
 *       "userId": "user-uuid-2",
 *       "siret": "98765432109876",
 *       "siren": "987654321",
 *       "legalName": "Tech Innovations",
 *       "legalForm": "SAS",
 *       "addressLine1": "456 Avenue des Champs",
 *       "postalCode": "75008",
 *       "city": "Paris",
 *       "country": "FR"
 *     }
 *   ],
 *   "validate": true,
 *   "ignoreDuplicates": false
 * }
 */
export const bulkCreateBusinessesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract businesses array and options from request body
    const { businesses, validate, ignoreDuplicates, updateOnDuplicate } =
      req.body;

    // Perform bulk creation within a transaction for data integrity
    // If any business fails validation or creation, all will be rolled back
    const result = await withTransaction(async (transaction) => {
      return await bulkCreateBusinesses(businesses, {
        transaction,
        validate: validate !== undefined ? validate : true,
        ignoreDuplicates: ignoreDuplicates || false,
        updateOnDuplicate: updateOnDuplicate,
      });
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
