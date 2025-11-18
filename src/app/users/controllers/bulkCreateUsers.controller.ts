/**
 * Bulk Create Users Controller
 * Handles HTTP request for creating multiple users
 */

import { Request, Response, NextFunction } from 'express';
import { bulkCreateUsers } from '../services/bulkCreateUsers.js';
import { verifyUser } from '../services/verifyUser.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Bulk create users
 * @route POST /api/users/bulk
 *
 * @remarks
 * Bulk operations benefit from transactions, especially when you need
 * to perform additional operations on the created users.
 */
export const bulkCreateUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { users, autoVerify } = req.body;

    // If autoVerify flag is set, use transaction to create and verify users atomically
    if (autoVerify) {
      const result = await withTransaction(async (t) => {
        const createdUsers = await bulkCreateUsers(
          users,
          { validate: true },
          t
        );

        // Verify all created users
        if (createdUsers.data) {
          const verificationPromises = createdUsers.data.map((user) =>
            verifyUser(user.userId, t)
          );
          await Promise.all(verificationPromises);
        }

        return createdUsers;
      });

      res.status(201).json(result);
    } else {
      // Simple bulk create without additional operations
      const result = await bulkCreateUsers(users, { validate: true });
      res.status(201).json(result);
    }
  } catch (error) {
    next(error);
  }
};
