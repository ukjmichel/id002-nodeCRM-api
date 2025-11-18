/**
 * Delete User Controller
 * Handles HTTP request for deleting a user
 */

import { Request, Response, NextFunction } from 'express';
import { deleteUser } from '../services/deleteUser.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Delete a user by ID
 * @route DELETE /api/users/:id
 *
 * @remarks
 * Deletion operations often benefit from transactions when you need
 * to clean up related records or perform cascade deletions.
 */
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // If you need to delete related records, use transaction
    const result = await withTransaction(async (t) => {
      // Delete related records first (if not using CASCADE)
      // await deleteUserSessions(id, t);
      // await deleteUserPreferences(id, t);
      // await deleteUserNotifications(id, t);

      // Then delete the user
      const deletedUser = await deleteUser(id, undefined, t);

      return deletedUser;
    });

    res.status(200).json(result);

    // Simple approach if no related records need cleanup:
    /*
    const result = await deleteUser(id);
    res.status(200).json(result);
    */
  } catch (error) {
    next(error);
  }
};
