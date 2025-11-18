// src/app/users/controllers/updatePassword.controller.ts
/**
 * Update Password Controller
 * Handles HTTP request for updating a user's password
 */

import { Request, Response, NextFunction } from 'express';
import { updatePassword } from '../services/updatePassword.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Update a user's password
 * @route PATCH /api/users/:id/password
 *
 * @remarks
 * Password updates should use transactions when you need to:
 * - Invalidate existing sessions
 * - Log security events
 * - Update password history
 */
export const updatePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Transaction approach for security-related operations
    const result = await withTransaction(async (t) => {
      const user = await updatePassword(id, newPassword, t);

      // Perform security-related operations atomically:
      // await invalidateAllUserSessions(id, t);
      // await addPasswordHistory(id, newPassword, t);
      // await logPasswordChange(id, t);
      // await sendPasswordChangeNotification(user.data.email);

      return user;
    });

    res.status(200).json(result);

    // Simple approach (not recommended for password changes):
    /*
    const result = await updatePassword(id, newPassword);
    res.status(200).json(result);
    */
  } catch (error) {
    next(error);
  }
};
