/**
 * Find Item By Barcode Controller
 * Handles HTTP request for retrieving a business item by barcode
 */

import { Request, Response, NextFunction } from 'express';
import { findItemByBarcode } from '../services/findItemByBarcode.js';

/**
 * Get an item by barcode
 * @route GET /api/business-items/barcode/:barcode
 *
 * @example
 * GET /api/business-items/barcode/0123456789012
 */
export const findItemByBarcodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { barcode } = req.params;
    const { include } = req.query;

    const options = {
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findItemByBarcode(barcode, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
