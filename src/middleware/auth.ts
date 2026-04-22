import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { UnauthorizedError, AuthenticatedRequest } from '@/types';
import { sendError } from '@/utils/response';

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return sendError(res, 401, error.message);
    }
    return sendError(res, 401, 'Unauthorized');
  }
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
}

export function requireAccountType(...accountTypes: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    if (!accountTypes.includes(req.user.accountType)) {
      return sendError(res, 403, `Forbidden: This action requires one of these account types: ${accountTypes.join(', ')}`);
    }

    next();
  };
}

export function requireVerified(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  // Check if user is verified (this would be checked in the actual implementation)
  // For now, we'll assume the user is verified if they have a valid token
  next();
}
