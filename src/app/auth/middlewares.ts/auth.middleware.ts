// src/app/auth/middleware/auth.middleware.ts
/**
 * Auth Middleware
 * Middleware to protect routes and verify JWT tokens from cookies
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../../../core/config/env.js';
import { ValidationError } from '../../../core/errors/index.js';
import { verifyAccessToken } from '../services/verifyToken.service.js';
import { TokenPayload } from '../interfaces/auth.interface.js';

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication Middleware
 * Verifies access token from cookies and attaches user to request
 *
 * @example
 * ```typescript
 * import { authMiddleware } from './middleware/auth.middleware';
 *
 * // Protect a route
 * router.get('/profile', authMiddleware, profileController);
 *
 * // Access user in controller
 * const userId = req.user?.userId;
 * ```
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get access token from cookies
    const accessToken = req.cookies[config.accessCookieName];

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        details: 'No access token found in cookies',
      });
      return;
    }

    // Verify access token
    const payload = verifyAccessToken(accessToken);

    // Attach user payload to request
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(401).json({
        success: false,
        message: error.message,
        details: error.details,
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Invalid token',
    });
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user to request if token exists, but doesn't fail if missing
 *
 * @example
 * ```typescript
 * import { optionalAuthMiddleware } from './middleware/auth.middleware';
 *
 * // Route accessible to both authenticated and unauthenticated users
 * router.get('/posts', optionalAuthMiddleware, postsController);
 *
 * // Check if user is authenticated in controller
 * if (req.user) {
 *   // Show personalized content
 * } else {
 *   // Show public content
 * }
 * ```
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get access token from cookies
    const accessToken = req.cookies[config.accessCookieName];

    if (accessToken) {
      // Try to verify token
      try {
        const payload = verifyAccessToken(accessToken);
        req.user = payload;
      } catch {
        // Token invalid, but that's okay for optional auth
        // Just continue without attaching user
      }
    }

    next();
  } catch (error) {
    // For optional auth, we still continue even on errors
    next();
  }
};

/**
 * Verified User Middleware
 * Ensures user is authenticated AND email is verified
 *
 * @example
 * ```typescript
 * import { verifiedUserMiddleware } from './middleware/auth.middleware';
 *
 * // Route only for verified users
 * router.post('/create-listing', verifiedUserMiddleware, createListingController);
 * ```
 */
export const verifiedUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First check authentication
    const accessToken = req.cookies[config.accessCookieName];

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        details: 'No access token found in cookies',
      });
      return;
    }

    // Verify access token
    const payload = verifyAccessToken(accessToken);

    // Check if user is verified
    if (!payload.verified) {
      res.status(403).json({
        success: false,
        message: 'Email verification required',
        details: 'Please verify your email to access this resource',
      });
      return;
    }

    // Attach user payload to request
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(401).json({
        success: false,
        message: error.message,
        details: error.details,
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Invalid token',
    });
  }
};
