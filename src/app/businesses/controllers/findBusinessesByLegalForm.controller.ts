/**
 * Find Businesses By Legal Form Controller
 * Handles HTTP request for retrieving businesses by legal form
 */

import { Request, Response, NextFunction } from 'express';
import { findBusinessesByLegalForm } from '../services/findBusinessesByLegalForm.js';


/**
 * Get all businesses with a specific legal form
 * @route GET /api/businesses/legal-form/:legalForm
 */
export const findBusinessesByLegalFormController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { legalForm } = req.params;
    const result = await findBusinessesByLegalForm(legalForm);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
