/**
 * Find Business By SIRET Controller
 * Handles HTTP request for retrieving a business by SIRET number
 */

import { Request, Response, NextFunction } from 'express';
import { findBusinessBySiret } from '../services/findBusinessBySiret.js';

/**
 * Get a business by SIRET number
 * @route GET /api/businesses/siret/:siret
 */
export const findBusinessBySiretController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { siret } = req.params;
    const { include } = req.query;

    const options = {
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findBusinessBySiret(siret, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
