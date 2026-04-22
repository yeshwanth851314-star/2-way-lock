import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@/types';
import { sendError } from '@/utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return sendError(res, 409, 'Unique constraint violation', {
      field: err.meta?.target?.[0],
    });
  }

  if (err.code === 'P2025') {
    return sendError(res, 404, 'Record not found');
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, 400, err.message, err.errors);
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return sendError(res, 413, 'File too large');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return sendError(res, 400, 'Too many files');
    }
    return sendError(res, 400, err.message);
  }

  // Default error
  return sendError(res, err.statusCode || 500, err.message || 'Internal server error');
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, 404, `Route not found: ${req.method} ${req.path}`);
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
