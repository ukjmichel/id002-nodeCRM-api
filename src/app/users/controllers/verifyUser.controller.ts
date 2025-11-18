// src/app/users/controllers/verifyUser.controller.ts
/**
 * Verify User Controller
 * Handles HTTP request for verifying a user account
 */

import { Request, Response, NextFunction } from 'express';
import { verifyUser } from '../services/verifyUser.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Verify a user account
 * @route PATCH /api/users/:id/verify
 *
 * @remarks
 * Verification is a single operation, so transaction is optional.
 * Use transaction if you need to perform additional actions on verification.
 */
export const verifyUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Simple approach
    const result = await verifyUser(id);
    res.status(200).json(result);

    // Transaction approach for additional operations:
    /*
    const result = await withTransaction(async (t) => {
      const user = await verifyUser(id, t);
      // Additional operations, e.g.:
      // await sendVerificationEmail(user.data.email, t);
      // await grantVerifiedUserPermissions(id, t);
      // await logVerification(id, t);
      return user;
    });
    res.status(200).json(result);
    */
  } catch (error) {
    next(error);
  }
};
