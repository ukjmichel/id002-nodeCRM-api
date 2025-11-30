/**
 * Find Item By SKU Controller
 * Handles HTTP request for retrieving a business item by SKU
 */

import { Request, Response, NextFunction } from 'express';
import { findItemBySku } from '../services/findItemBySku.js';

/**
 * Get an item by SKU
 * @route GET /api/items/sku/:sku
 *
 * @example
 * GET /api/items/sku/PIZZA-001
 */
export const findItemBySkuController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sku } = req.params;
    const { include } = req.query;

    const options = {
      ...(include && { include: JSON.parse(include as string) }),
    };

    const result = await findItemBySku(sku, options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
