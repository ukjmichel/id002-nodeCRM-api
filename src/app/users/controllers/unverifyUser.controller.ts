// src/app/users/controllers/unverifyUser.controller.ts
/**
 * Unverify User Controller
 * Handles HTTP request for unverifying a user account
 */

import { Request, Response, NextFunction } from 'express';
import { unverifyUser } from '../services/unverifyUser.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Unverify a user account
 * @route PATCH /api/users/:id/unverify
 *
 * @remarks
 * Unverification might require revoking permissions or access.
 * Use transaction when you need atomic multi-step operations.
 */
export const unverifyUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Transaction approach for revoking access atomically
    const result = await withTransaction(async (t) => {
      const user = await unverifyUser(id, t);
      // Revoke related permissions/access, e.g.:
      // await revokeVerifiedPermissions(id, t);
      // await invalidateUserSessions(id, t);
      // await logUnverification(id, t);
      return user;
    });

    res.status(200).json(result);

    // Simple approach if no related operations:
    /*
    const result = await unverifyUser(id);
    res.status(200).json(result);
    */
  } catch (error) {
    next(error);
  }
};
