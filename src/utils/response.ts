import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  } as ApiResponse<T>);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  statusCode: number = 200
): Response {
  const totalPages = Math.ceil(total / pageSize);
  return res.status(statusCode).json({
    success: true,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages,
    } as PaginatedResponse<T>,
    message: 'Success',
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, any>
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  } as ApiResponse);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Created'
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}
