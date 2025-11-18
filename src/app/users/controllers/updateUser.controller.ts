/**
 * Update User Controller
 * Handles HTTP request for updating a user
 */

import { Request, Response, NextFunction } from 'express';
import { updateUser } from '../services/updateUser.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Update a user by ID
 * @route PUT /api/users/:id
 *
 * @remarks
 * For simple profile updates, no transaction needed.
 * Use transactions when updating multiple related records.
 */
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Simple approach for single update
    const result = await updateUser(id, req.body);
    res.status(200).json(result);

    // Example: Transaction approach for complex updates
    // Uncomment if you need to update related records:
    /*
    const result = await withTransaction(async (t) => {
      const user = await updateUser(id, req.body, undefined, t);
      // Update related records, e.g.:
      // await updateUserPreferences(id, req.body.preferences, t);
      // await logUserUpdate(id, req.body, t);
      return user;
    });
    res.status(200).json(result);
    */
  } catch (error) {
    next(error);
  }
};
