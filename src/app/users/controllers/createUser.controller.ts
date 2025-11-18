/**
 * Create User Controller
 * Handles HTTP request for creating a new user
 */

import { Request, Response, NextFunction } from 'express';
import { createUser } from '../services/createUser.js';
import { withTransaction } from '../../../core/utils/tx.js';


/**
 * Create a new user
 * @route POST /api/users
 *
 * @remarks
 * For simple single-operation requests, transactions are optional since
 * Sequelize already wraps individual operations in transactions.
 * However, if you need to perform additional operations after user creation,
 * you can use withTransaction at the controller level.
 */
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Simple approach (single operation)
    const result = await createUser(req.body);
    res.status(201).json(result);

    // Example: Transaction approach for multi-step operations
    // Uncomment and modify if you need to perform multiple operations:
    /*
    const result = await withTransaction(async (t) => {
      const user = await createUser(req.body, undefined, t);
      // Additional operations can go here, e.g.:
      // await sendWelcomeEmail(user.data.email, t);
      // await createUserProfile(user.data.userId, t);
      return user;
    });
    res.status(201).json(result);
    */
  } catch (error) {
    next(error);
  }
};
